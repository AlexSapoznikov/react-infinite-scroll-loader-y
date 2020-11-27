/**
 * Infinite scroll component
 */
import React, { forwardRef, RefObject, useEffect, useImperativeHandle, useState, Fragment, createRef } from 'react';
import { getBodyScrollHeight, getBodyScrollPosition } from './utils/dom-element-helpers';

type Props = {
  loadMore: (page: number) => void,
  dataLength: number,
  children: React.ReactNode,
  hasMore: boolean,
  loader?: React.ReactNode,
  threshold?: number,
  parentRef?: RefObject<any>,
  startPage?: number,
  loadFirstSetOnInit?: boolean,
  resetDependencies?: any | Array<any>, // Reset happens when these dependencies change
  disabled?: boolean,
}

type ResetToType = {
  startPage?: number
};

export type InfiniteScrollRefType = {
  reset: (resetTo?: ResetToType) => void,
};

const InfiniteScroll = forwardRef((props: Props, ref: RefObject<any>) => {
  const {
    children,
    dataLength,
    loadMore,
    hasMore,
    loader,
    threshold,
    parentRef,
    startPage,
    loadFirstSetOnInit,
    resetDependencies,
    disabled
  } = props;
  const defaultThreshold = 250;

  const dummyContentRef = createRef<HTMLDivElement>();

  // Initial state
  const [firstPage, setFirstPage] = useState(startPage && startPage >= 0 ? startPage : 0); // Keep in state, so it won't change from props
  const [page, setPage] = useState(firstPage);
  const [currentDataLength, setCurrentDataLength] = useState(dataLength);
  const [pagesLoaded, setPagesLoaded] = useState<number[]>([]);

  // Dependencies to array of dependencies
  const externalResetDependencies = (Array.isArray(resetDependencies) ? resetDependencies : [resetDependencies]);

  // Reset
  const reset = (resetTo: ResetToType = {}) => {
    const { startPage: resetToStartPage }: any = resetTo;

    if (Number.isInteger(resetToStartPage) && resetToStartPage >= 0) {
      // Reset to passed first page
      setFirstPage(resetToStartPage);
      setPage(resetToStartPage);
    } else {
      // If start page not passed, reset to firstPage that component was initialized with
      setPage(firstPage);
    }

    setCurrentDataLength(dataLength);
    setPagesLoaded([]);
  };

  // Expose data to ref
  useImperativeHandle(ref, (): InfiniteScrollRefType => ({
    reset,
  }));

  // Reset all to initial state when reset dependencies change
  useEffect(() => {
    reset();
  }, externalResetDependencies);

  // Trigger page change
  useEffect(() => {
    if (!Number.isInteger(currentDataLength)) {
      console.error('InfiniteScroll: dataLength prop is not a number', currentDataLength);
    }

    if (dataLength > currentDataLength) {
      setPage(page + 1);
    }

    setCurrentDataLength(dataLength);
  }, [dataLength]);

  // Load next set of data
  useEffect(() => {
    if (disabled) {
      return;
    }

    const parentElement = parentRef?.current;

    const handle = () => {
      const scrollPosition = parentElement
        ? parentElement.scrollTop + parentElement.offsetHeight
        : getBodyScrollPosition() + window.innerHeight;
      const scrollHeight = parentElement
        ? parentElement.scrollHeight
        : getBodyScrollHeight();
      const loadOnInit = loadFirstSetOnInit && page === firstPage;
      const thresholdExceeded = scrollHeight - scrollPosition < (threshold || defaultThreshold);
      const isPageLoaded = pagesLoaded.includes(page);
      const isParentHidden = dummyContentRef?.current?.parentElement?.offsetHeight === 0;

      // If there is more items to load and scroll position exceeds threshold, then load more items
      if ((loadOnInit || (hasMore && thresholdExceeded)) && !isPageLoaded && !isParentHidden) {
        setPagesLoaded([...pagesLoaded, page]);
        loadMore(page);
      }
    };

    // Initial run
    handle();

    // Add event listener after load
    (parentElement || window).addEventListener('scroll', handle);
    (parentElement || window).addEventListener('resize', handle);

    // Cleanup
    return () => {
      (parentElement || window).removeEventListener('scroll', handle);
      (parentElement || window).removeEventListener('resize', handle);
    };
  }, [
    page,
    pagesLoaded,
    hasMore,
    disabled
  ]);

  return (
    <Fragment>
      {/* dummy inside child for getting parent dom element */}
      <div ref={dummyContentRef}
           style={{ display: 'none' }}
      />

      {/* items */}
      { children }

      {/* loader */}
      { hasMore && loader }
    </Fragment>
  );
});

export default InfiniteScroll;
