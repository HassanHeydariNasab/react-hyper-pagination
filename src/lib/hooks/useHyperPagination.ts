import { useState } from "react";
import { useAfterKeyPagination } from "./useAfterKeyPagination";
import { useSlicePagination } from "./useSlicePagination";

interface UseHyperPaginationProps {
  defaultSuperLimit: number;
  defaultMicroLimit: number;
}

export function useHyperPagination({
  defaultMicroLimit,
  defaultSuperLimit,
}: UseHyperPaginationProps) {
  const [superItems, setSuperItems] = useState<unknown[]>([]);

  const {
    afterKey: superAfterKey,
    currentPageNumber: superCurrentPageNumber,
    limit: superLimit,
    hasNext: superHasNext,
    hasPrev: superHasPrev,
    goToPreviousPage: superGoToPreviousPage,
    goToNextPage: superGoToNextPage,
    onChangeLimit: superOnChangeLimit,
    resetPagination: superResetPagination,
    onAfterKeyReceived: superOnAfterKeyReceived,
  } = useAfterKeyPagination({ defaultLimit: defaultSuperLimit });

  const {
    currentPageItems: microCurrentPageItems,
    currentPageNumber: microCurrentPageNumber,
    lastPageNumber: microLastPageNumber,
    hasNext: microHasNext,
    hasPrev: microHasPrev,
    limit: microLimit,
    resetPagination: microResetPagination,
    onChangeLimit: microOnChangeLimit,
    goToNextPage: microGoToNextPage,
    goToPreviousPage: microGoToPreviousPage,
    setCurrentPageNumber: microSetCurrentPageNumber,
  } = useSlicePagination({
    defaultLimit: defaultMicroLimit,
    items: superItems,
  });

  const goToNextPage = () => {
    if (microHasNext) {
      microGoToNextPage();
    } else {
      if (superHasNext) {
        // end of micro, go to the start of the next super
        superGoToNextPage();
        microResetPagination();
      } else {
        // end of everything
        return;
      }
    }
  };

  const goToPreviousPage = () => {
    if (microHasPrev) {
      microGoToPreviousPage();
    } else {
      if (superHasPrev) {
        // start of micro, go to the end of the prev super
        microSetCurrentPageNumber(microLastPageNumber);
        superGoToPreviousPage();
      } else {
        // start of everything
        return;
      }
    }
  };

  const currentPageNumber =
    Math.floor(((superCurrentPageNumber - 1) * superLimit) / microLimit) +
    microCurrentPageNumber;

  return {
    /** Fetch a super page, when `superAfterKey` changes. */
    superAfterKey,
    /** It's usually what you want to show to the user */
    microCurrentPageItems,
    /** The current page number based on super and micro current page numbers.
     * Starts from 1
     * */
    currentPageNumber,
    /** The last micro page we can jump within the super page */
    microLastPageNumber,
    microLimit,
    superLimit,
    goToNextPage,
    goToPreviousPage,
    superResetPagination,
    /** Call this when you get a new `afterKey` from API */
    superOnAfterKeyReceived,
    superOnChangeLimit,
    superHasNext,
    superHasPrev,
    hasNext: microHasNext || superHasNext,
    hasPrev: microHasPrev || superHasPrev,
    microOnChangeLimit,
    superCurrentPageNumber,
    microCurrentPageNumber,
    /** Call this when you get new items from API */
    setSuperItems,
  };
}
