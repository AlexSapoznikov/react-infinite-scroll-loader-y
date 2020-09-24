# react-infinite-scroll-loader-y

> React component for fetching new data on vertical scroll

[![NPM](https://img.shields.io/npm/v/react-infinite-scroll-loader-y.svg)](https://www.npmjs.com/package/react-infinite-scroll-loader-y) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-infinite-scroll-loader-y
```

## Usage

```tsx
import React, { useState } from 'react'

import InfiniteScroll from 'react-infinite-scroll-loader-y'

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
                    loadFirstSetOnInit={!items.length}
                    startPage={Math.ceil(items.length / ITEMS_PER_PAGE)}
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

More detailed docs coming soon...

## License

MIT © [https://github.com/AlexSapoznikov/react-infinite-scroll-loader-y](https://github.com/https://github.com/AlexSapoznikov/react-infinite-scroll-loader-y)
