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
                    batchSize={ITEMS_PER_PAGE}
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
