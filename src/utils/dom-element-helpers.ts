/**
 * Crossbrowser way to get body scroll position
 */
export function getBodyScrollPosition () {
  return Math.max(
    document.documentElement && document.documentElement.scrollTop,
    document.body && document.body.scrollTop,
    // @ts-ignore
    document.scrollingElement && document.scrollingElement.scrollTop
  );
}

/**
 * Crossbrowser way to get body scroll height
 */
export function getBodyScrollHeight () {
  return Math.max(
    document.documentElement && document.documentElement.scrollHeight,
    document.body && document.body.scrollHeight,
    // @ts-ignore
    document.scrollingElement && document.scrollingElement.scrollHeight
  );
}
