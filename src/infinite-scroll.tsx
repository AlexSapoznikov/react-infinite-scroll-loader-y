/**
 * Infinite scroll component
 */
import React, {
  forwardRef,
  RefObject,
  useEffect,
  useImperativeHandle,
  useState,
  Fragment,
  createRef,
  useRef
} from 'react';
import isEqual from 'lodash.isequal';
import { getBodyScrollHeight, getBodyScrollPosition } from './utils/dom-element-helpers';

export type InfiniteScrollProps = {
  loadMore: (page: number, params: {
    limit: number;
    offset: number;
  }) => void;
  dataLength: number;
  batchSize: number;
  children: React.ReactNode;
  hasMore: boolean;
  loader?: React.ReactNode;
  threshold?: number;
  parentRef?: RefObject<any>;
  startPage?: number;
  manualLoadFirstSet?: boolean;
  resetDependencies?: Array<any>; // Reset happens when these dependencies change
  disabled?: boolean;
  beforeEachLoad?: (args: InfiniteScrollRefType) => boolean|void; // Return true to stop loading next page.
}

export type InfiniteScrollRefType = {
  reset: () => void,
};

// @ts-ignore
const InfiniteScroll = forwardRef((props: InfiniteScrollProps, ref: RefObject<InfiniteScrollRefType>) => {
  const {
    children,
    dataLength,
    batchSize,
    loadMore,
    hasMore,
    loader,
    threshold,
    parentRef,
    manualLoadFirstSet,
    resetDependencies,
    disabled,
    beforeEachLoad,
  } = props;
  const defaultThreshold = 250;
  
  // Initial state
  const [previousResetDependencies, setPreviousResetDependencies] = useState(resetDependencies);

  const [nextPageToLoad, setNextPageToLoad] = useState(0);
  const lastPageLoadedRef = useRef(-1);

  const wrapperRef = createRef<HTMLDivElement>();

  const getNextPageToLoad = () => Math.ceil((dataLength || 0) / (batchSize || 1));
      
  // Reset
  const reset = () => {
    setPreviousResetDependencies(resetDependencies);
    lastPageLoadedRef.current = -1;
    setNextPageToLoad(0);
  };

  // Expose data to ref
  useImperativeHandle(ref, (): InfiniteScrollRefType => ({
    reset,
  }));

  // Trigger page change
  useEffect(() => {
    const newNextPageToLoad = getNextPageToLoad();

    setNextPageToLoad(newNextPageToLoad);
  }, [dataLength]);

  const load = () => {
    if (disabled) {
      return;
    }

    // Do not load if it is first set and manualLoadFirstSet mode enabled.
    if (manualLoadFirstSet && nextPageToLoad === 0) {
      return;
    }

    const parentElement = parentRef?.current;
    const scrollPosition = parentElement
      ? parentElement.scrollTop + parentElement.offsetHeight
      : getBodyScrollPosition() + window.innerHeight;
    const scrollHeight = parentElement
      ? parentElement.scrollHeight
      : getBodyScrollHeight();
    const thresholdExceeded = scrollHeight - scrollPosition < (threshold || defaultThreshold);
    const isPageLoaded = nextPageToLoad <= lastPageLoadedRef.current;
    const isParentHidden = wrapperRef?.current?.parentElement?.offsetHeight === 0;

    // If there is more items to load and scroll position exceeds threshold, then load more items
    if (hasMore && thresholdExceeded && !isPageLoaded && !isParentHidden) {
      // Set last loaded page so we would not load the same page twice.
      lastPageLoadedRef.current = nextPageToLoad;

      loadMore(nextPageToLoad, {
        limit: batchSize,
        offset: nextPageToLoad * batchSize,
      });
    }
  };

  // Load next set of data
  useEffect(() => {
    if (disabled) {
      return;
    }

    // Check if consumer component wants to stop loading.
    const stopNextLoad = beforeEachLoad?.({ reset }) as boolean;

    if (stopNextLoad) {
      return;
    }

    // Reset if dependencies changes.
    if (!isEqual(resetDependencies, previousResetDependencies)) {
      reset();

      return;
    }

    const parentElement = parentRef?.current;

    // Add event listener after load
    (parentElement || window).addEventListener('scroll', load);
    (parentElement || window).addEventListener('resize', load);

    // Check loading beginning from first page as first page is loaded in separate useEffect().
    load();

    // Cleanup
    return () => {
      (parentElement || window).removeEventListener('scroll', load);
      (parentElement || window).removeEventListener('resize', load);
    };
  });

  return (
    <Fragment>
      {/* Wrapper inside child for getting parent dom element */}
      <div ref={wrapperRef}
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
