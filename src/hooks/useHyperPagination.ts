import { useAfterKeyPagination } from "./useAfterKeyPagination";
import { useSlicePagination } from "./useSlicePagination";

interface UseHyperPaginationProps<T> {
  defaultSuperLimit: number;
  defaultMicroLimit: number;
  superItems: T[];
}

export function useHyperPagination<T>({
  defaultMicroLimit,
  defaultSuperLimit,
  superItems,
}: UseHyperPaginationProps<T>) {
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

  const goToNext = () => {
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

  const goToPrev = () => {
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
    superAfterKey,
    /** It's usually what you want to show to the user */
    microCurrentPageItems,
    currentPageNumber,
    microLastPageNumber,
    microLimit,
    superLimit,
    goToNext,
    goToPrev,
    superResetPagination,
    superOnAfterKeyReceived,
    superOnChangeLimit,
    superHasNext,
    superHasPrev,
    microOnChangeLimit,
  };
}
