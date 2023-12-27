import { useState } from "react";

interface UseAfterKeyPaginationProps {
  defaultLimit: number;
}

export function useAfterKeyPagination({
  defaultLimit,
}: UseAfterKeyPaginationProps) {
  const [state, setState] = useState<{
    currentPageIndex: number;
    limit: number;
  }>({
    currentPageIndex: 0,
    limit: defaultLimit,
  });

  /** The `afterKey` to fetch the first page is `undefined`.*/
  const [afterKeys, setAfterKeys] = useState<unknown[]>([undefined]);

  /** Ask for current page data using `afterKey` */
  const afterKey = afterKeys[state.currentPageIndex];

  const hasNext = afterKeys[state.currentPageIndex + 1] !== undefined;
  const hasPrev = state.currentPageIndex >= 1;

  /** Call this function when you receive a new `afterKey` from the server,
   * Even if it's `undefined` (which means there is no more data to fetch)
   * */
  const onAfterKeyReceived = (afterKey: unknown) => {
    setAfterKeys((afterKeys) => [...afterKeys, afterKey]);
  };

  /** It increases the `currentPageNumber` by 1, then you can use
   * `afterKey` to get the next page.
   **/
  const goToNextPage = () => {
    setState((state) => {
      if (afterKeys[state.currentPageIndex + 1] === undefined) return state;
      return {
        ...state,
        currentPageIndex: state.currentPageIndex + 1,
      };
    });
  };

  /** It decreases the `currentPageNumber` by 1, then you can use
   * `afterKey` to get the previous page.
   **/
  const goToPreviousPage = () => {
    if (!hasPrev) return;
    setState((state) => {
      if (state.currentPageIndex === 0) return state;
      return {
        ...state,
        currentPageIndex: state.currentPageIndex - 1,
      };
    });
  };

  /** It changes the `limit` and resets the pagination to the first page. */
  const onChangeLimit = (limit: number) => {
    setAfterKeys([undefined]);
    setState({ currentPageIndex: 0, limit });
  };

  /** It resets the pagination to the first page and clears `afterKeys` */
  const resetPagination = () => {
    setAfterKeys([undefined]);
    setState((state) => ({ ...state, currentPageIndex: 0 }));
  };

  return {
    /** Fetch a page using `afterKey`, when `afterKey` changes. */
    afterKey,
    hasNext,
    hasPrev,
    limit: state.limit,
    /** Starts from 1 */
    currentPageNumber: state.currentPageIndex + 1,
    /** Call this function when you receive a new `afterKey` from API */
    onAfterKeyReceived,
    onChangeLimit,
    goToNextPage,
    goToPreviousPage,
    resetPagination,
  };
}
