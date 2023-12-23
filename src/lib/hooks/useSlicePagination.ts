import { useState } from "react";

interface UseSlicePaginationProps<T = unknown> {
  defaultLimit: number;
  items: T[];
}

export function useSlicePagination<T>({
  defaultLimit,
  items,
}: UseSlicePaginationProps<T>) {
  const [state, setState] = useState<{
    offset: number;
    limit: number;
  }>({
    offset: 0,
    limit: defaultLimit,
  });

  const goToNextPage = () => {
    setState((state) => {
      if (state.offset + state.limit > items.length) return state;
      return {
        ...state,
        offset: state.offset + state.limit,
      };
    });
  };

  const goToPreviousPage = () => {
    setState((state) => ({
      ...state,
      offset: state.offset - state.limit < 0 ? 0 : state.offset - state.limit,
    }));
  };

  /** It changes the `limit` and resets the pagination to the first page. */
  const onChangeLimit = (limit: number) => {
    setState((state) => ({ ...state, limit, offset: 0 }));
  };

  /** It resets the pagination to the first page */
  const resetPagination = () => {
    setState((state) => ({ ...state, offset: 0 }));
  };

  const setCurrentPageNumber = (currentPageNumber: number) => {
    setState((state) => ({
      ...state,
      offset: (currentPageNumber - 1) * state.limit,
    }));
  };

  const currentPageNumber =
    state.limit === 0 ? 1 : Math.floor(state.offset / state.limit) + 1;

  const currentPageItems = items.slice(
    state.offset,
    state.offset + state.limit,
  );

  return {
    currentPageItems,
    /** Starts from 1 */
    currentPageNumber,
    lastPageNumber:
      state.limit === 0 ? 1 : Math.ceil(items.length / state.limit),
    hasNext: state.offset + state.limit < items.length,
    hasPrev: state.offset - state.limit >= 0,
    limit: state.limit,
    setCurrentPageNumber,
    onChangeLimit,
    goToNextPage,
    goToPreviousPage,
    resetPagination,
  };
}
