# react-infinite-scroll-loader-y

**IMPORTANT!**
Version 2.0.0 has **breaking changes**.
- `loadFirstSetOnInit` prop was removed. Look into `manualLoadFirstSet` instead.
- `startPage` prop was removed. Look into `batchSize` prop instead which is mandatory.
- `resetDependencies` props must now always be an array.

___

React component for fetching new data on vertical scroll

[![NPM](https://img.shields.io/npm/v/react-infinite-scroll-loader-y.svg)](https://www.npmjs.com/package/react-infinite-scroll-loader-y) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-infinite-scroll-loader-y
```

## Demo

[![https://codesandbox.io/s/react-infinite-scroll-loader-y-v2-0-0-d4pl25](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-infinite-scroll-loader-y-v2-0-0-d4pl25)

## Usage
- Using this component looks basically like this:

```tsx
<InfiniteScroll dataLength={items.length}
                batchSize={50}
                loadMore={page => loadMoreItems(page)}
                hasMore={hasMoreItems}
>
  {
    items.map(item => (
      <div>
        { item }
      </div>
    ))
  }
</InfiniteScroll>
```

## Docs

| Property | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| **dataLength** | **Yes** | `number` | | The length of items. Needed for loading next page. |
| **batchSize** | **Yes** | `number` | | The amount of items to load per each request. |
| **hasMore** | **Yes** | `boolean` | |  Boolean to indicate whether there are more items to load. Setting it to `false` disables loadMore() function and won't load next page of items. |
| **loadMore** | **Yes** | `(page, { offset, limit }) => void` | | Function for loading next page of items. |
| threshold | No | `number` | `250` | Defines minimum space from bottom of your page when new items need to be loaded. |
| manualLoadFirstSet | No | `boolean` | `false` | Will not load first set of items automatically. Will proceed loading items automatically when first batch is loaded. |
| loader | No | `React.ReactNode` | | Loading component. Can be a simple text, animated icon or more sophisticated React component. |
| parentRef | No | `RefObject<any>` | | Pass ref of parent HTML element if you want scroll-loading to happen inside that HTML Element. Useful for applying scroll loader for example inside modals and specific DIVs. |
| resetDependencies | No | `Array<any>` | | Dependencies that will trigger reset of everything |
| disabled | No | `boolean` | `false` | Disables current component |
| beforeEachLoad | No | `(reset: fn) => boolean/void` | | Function that runs before each render. If it returns `true` then the next render will not be triggered.


## Example
- Complete example:

```tsx
import React, { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-loader-y'

// Mock GET request
function request ({ offset, limit }: { offset: number, limit: number }): Promise<{ data: string[], total: number }> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: Array(500).fill(null).map((_, i) => `item-${i + 1}`).slice(offset, offset + limit),
        total: 500,
      });
    }, 500)
  });
}

const App = () => {
  const [items, setItems] = useState<string[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);

  const ITEMS_PER_PAGE = 20;

  // Load next page of items
  const loadMoreItems = async (page: number) => {
    const { data: nextItems, total } = await request({
      offset: ITEMS_PER_PAGE * page,
      limit: ITEMS_PER_PAGE,
    });

    // Combine items
    const combinedItems = items.concat(nextItems || []);

    // Check for more
    setHasMoreItems(!!nextItems?.length && total > combinedItems.length);

    // Save items to state
    setItems(combinedItems);
  };

  return (
    <InfiniteScroll dataLength={items.length}
                    loadMore={page => loadMoreItems(page)}
                    hasMore={hasMoreItems}
                    loader={<div>Loading...</div>}
    >
      {
        items.map(item => (
          <div>
            { item }
          </div>
        ))
      }
    </InfiniteScroll>
  )
};

export default App

```

## Advanced usage

Following example shows complete possible use case of `InfiniteScroll` together with caching items in react context.
<br />
It can keep data when browser back button is clicked and query params match for the page. Otherwise cache is invalidated.

```tsx
/**
 * globalContext.tsx
 * 
 * Global context for keeping data that is used in multiple pages/components.
 * 
 * Use should wrap your code on root level with <GlobalContextProvider>, for example in next.js in _app.tsx file.
 */

import React, { ReactNode, useRef, useState } from 'react';

type Props = {
  children: ReactNode | ReactNode[];
};

type GlobalContextKey = string | number;
type GlobalContextValue = unknown;

type GlobalContextInnerState = {
  set: (key: GlobalContextState) => void;
  get: (key: GlobalContextKey) => GlobalContextValue;
};

// Add keys here for typescript and better suggestion.
type GlobalContextState = Record<GlobalContextKey, GlobalContextValue> & {
  items?: unknown[];
  hasMoreItems?: boolean;
};

export const GlobalContext = React.createContext({} as GlobalContextInnerState & GlobalContextState);

const GlobalContextProvider = ({ children }: Props) => {
  const [state, setState] = useState<GlobalContextState>({
    items: [],
    hasMoreItems: true,
  });
  const lastState = useRef<GlobalContextState>(state);

  const set = (addState: GlobalContextState) => {
    lastState.current = {
      ...lastState.current,
      ...(addState || {}),
    };

    setState(lastState.current);

    return lastState.current;
  };

  const get = (key: string | number) => state[key];

  return <GlobalContext.Provider value={{ set, get, ...state }}>{children}</GlobalContext.Provider>;
};

export default GlobalContextProvider;

```

```tsx
/**
 * _app.tsx
 * 
 * Make sure to wrap your code with <GlobalContextProvider> on root level of the app.
 */
import GlobalContextProvider from './globalContext';

...
const MyApp = () => {
  ...
  return (
    <>
      <GlobalContextProvider>
        ...your rest code
      </GlobalContextProvider>
    </>
  )
}

export default MyApp;
```

```tsx
/**
 * useGlobalContext.tsx
 * 
 * Hook for using global context.
 *
 * Usage:
 *
 * const globalContext = useGlobalContext();
 * globalContext.set({'key': 'value', 'key2': 'value2', ...});
 */
import { GlobalContext } from './globalContext';
import { useContext } from 'react';

const useGlobalContext = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalContextProvider');
  }

  return context;
};

export default useGlobalContext;
```

```tsx
// Page component that uses InfiniteScroll.

export const Page = () => {
  const setCacheKey = (cacheKey) => set({ cacheKey });
  const cacheKey = get('cacheKey') as string;
  const isCacheApplied = getNewCacheKey() === cacheKey;

  const items = isCacheApplied ? get('items') as unknown[] : [];
  const setItems = (items) => set({ items });

  const hasMoreItems = isCacheApplied ? get('hasMoreItems') as boolean : true;
  const setHasMoreItems = (hasMoreItems) => set({ hasMoreItems });

  const [wasCachedOnInit, setWasCachedOnInit] = useState(isCacheApplied);

  const { query } = useRouter(); // Getting query params in Next.js

  function getNewCacheKey (): string {
    return 'some-generated-cache-key' + JSON.stringify(query);
  }

  const loadMoreItems = async (page: number, initialItems: unknown[] = items) => {
    const { data: nextItems, total } = await request({
      offset: ITEMS_PER_PAGE * page,
      limit: ITEMS_PER_PAGE,
    });

    // Combine items
    const combinedItems = initialItems.concat(nextItems || []);

    // Check for more
    setHasMoreItems(!!nextItems?.length && total > combinedItems.length);

    // Save items to state
    setItems(combinedItems);
  };

  // Set cache on load.
  const infiniteScrollBeforeEachLoad = ({ reset }) => {
    const newItemCacheKey = getNewCacheKey();

    // If url changed (cache key), make new request.
    if (newItemCacheKey !== cacheKey) {
      setCacheKey(newItemCacheKey);
      reset(); // This will reset everything internally in InfiniteScroll component.
      setItems([]);
      loadMoreItems(0, []);
      setHasMoreItems(true);
      window.scrollTo(0, 0);

      // Stop loading next page this time.
      return true;
    }
  };

  return (
    <InfiniteScroll
      dataLength={items.length}
      batchSize={ITEMS_PER_PAGE}
      loadMore={(page) => loadMoreItems(page)}
      hasMore={hasMoreItems}
      loader={<div>Loading...</div>}
      manualLoadFirstSet
      beforeEachLoad={infiniteScrollBeforeEachLoad}
    >
      {
        items.map(item => (
          <div>
            { item }
          </div>
        ))
      }
    </InfiniteScroll>
  )
}
```

## Changelog

- v1.0.6 - Add height check to container to stop loading more data if containers height is 0.
- v2.0.0 - Re-implemented. Breaking changes. Removes excess renders and duplicate request on some rare cases.

## License

MIT © [https://github.com/AlexSapoznikov/react-infinite-scroll-loader-y](https://github.com/AlexSapoznikov/react-infinite-scroll-loader-y)
