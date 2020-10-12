# react-infinite-scroll-loader-y

React component for fetching new data on vertical scroll

[![NPM](https://img.shields.io/npm/v/react-infinite-scroll-loader-y.svg)](https://www.npmjs.com/package/react-infinite-scroll-loader-y) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-infinite-scroll-loader-y
```

## Demo

[![https://codesandbox.io/s/react-infinite-scroll-loader-y-1g7d0](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-infinite-scroll-loader-y-1g7d0)

## Usage
- Using this component looks basically like this:

```tsx
<InfiniteScroll dataLength={items.length}
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
| **hasMore** | **Yes** | `boolean` | |  Boolean to indicate whether there are more items to load. Setting it to `false` disables loadMore() function and won't load next page of items. |
| **loadMore** | **Yes** | function / `(page: number) => void` | | Function for loading next page of items. |
| threshold | No | `number` | `250` | Defines minimum space from bottom of your page when new items need to be loaded. |
| startPage | No | `number` | `0` | The first page of items that will be loaded. |
| loadFirstSetOnInit | No | `boolean` | `false` | Enforces loading first page even if `hasMore` is set to `false` |
| loader | No | `React.ReactNode` | | Loading component. Can be a simple text, animated icon or more sophisticated React component. |
| parentRef | No | `RefObject<any>` | | Pass ref of parent HTML element if you want scroll-loading to happen inside that HTML Element. Useful for applying scroll loader for example inside modals and specific DIVs. |
| resetDependencies | No | `any or Array<any>` | | Dependencies that will trigger reset of everything |
| disabled | No | `boolean` | `false` | Disables current component |


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

## Tips
- If you are caching your data for example with redux store, you might want to apply `loadFirstSetOnInit` and `startPage` props:
    - `loadFirstSetOnInit` will forcefully try to load next page
    - `startPage` will continue from the data length that was previously loaded

```tsx
    const ITEMS_PER_PAGE = 20;

    <InfiniteScroll dataLength={items.length}
                    loadMore={page => loadMoreItems(page)}
                    hasMore={hasMoreItems}
                    loadFirstSetOnInit={!items.length}
                    startPage={Math.ceil(items.length / ITEMS_PER_PAGE)}
    >...
```

- If at some point you want to reset loading and `resetDependencies` property doesn't help or you want to trigger it manually, you can do it like so:
    - Apply ref to `InfiniteScroll` component
    - Use that ref to reset data to desired startPage
```tsx
  // Infinite scroll ref
  const infiniteScrollRef = useRef<InfiniteScrollRefType>();

  // Function that will reset
  const reset = () => {
    infiniteScrollRef?.current?.reset({ startPage: 0 });
  }

  return (
    <InfiniteScroll ref={infiniteScrollRef}
                    ...
    >
  )
```

## License

MIT © [https://github.com/AlexSapoznikov/react-infinite-scroll-loader-y](https://github.com/AlexSapoznikov/react-infinite-scroll-loader-y)
