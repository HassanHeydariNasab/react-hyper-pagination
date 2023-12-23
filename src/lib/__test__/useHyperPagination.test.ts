import { expect, test, describe } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useHyperPagination } from "../hooks/useHyperPagination";

describe("useAfterKeyPagination", () => {
  test("should work", () => {
    const ITEMS = Array.from({ length: 39 }, (_, i) => `item-${i}`);

    const SUPER_LIMIT = 10;
    const MICRO_LIMIT = 5;

    const fetchItems = (afterKey: unknown, limit: number) => {
      const afterKeyIndex = ITEMS.findIndex((item) => item === afterKey);
      const items = ITEMS.slice(afterKeyIndex + 1, afterKeyIndex + 1 + limit);
      return {
        items,
        afterKey:
          ITEMS.length - limit <= afterKeyIndex
            ? undefined
            : items[items.length - 1],
      };
    };

    const { result } = renderHook(() =>
      useHyperPagination({
        defaultSuperLimit: SUPER_LIMIT,
        defaultMicroLimit: MICRO_LIMIT,
      }),
    );

    expect(result.current.currentPageNumber).toBe(1);
    expect(result.current.superAfterKey).toBeUndefined();
    expect(result.current.superHasPrev).toBe(false);
    expect(result.current.superHasNext).toBe(false); // because we don't have any afterKey yet.

    const { items: items1, afterKey: afterKey1 } = fetchItems(
      result.current.superAfterKey,
      result.current.superLimit,
    );

    expect(items1).toHaveLength(10);
    expect(afterKey1).toBe("item-9");

    act(() => {
      result.current.superOnAfterKeyReceived(afterKey1);
      result.current.setSuperItems(items1);
    });

    // still on page 1
    expect(result.current.currentPageNumber).toBe(1);
    expect(result.current.superAfterKey).toBeUndefined();
    expect(result.current.superHasPrev).toBe(false);
    expect(result.current.superHasNext).toBe(true);
    expect(result.current.hasPrev).toBe(false);
    expect(result.current.hasNext).toBe(true);

    act(() => {
      result.current.goToNextPage();
    });

    // now we are on page 2
    expect(result.current.currentPageNumber).toBe(2);
    expect(result.current.superAfterKey).toBeUndefined();
    expect(result.current.superHasPrev).toBe(false);
    expect(result.current.superHasNext).toBe(true);
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(true);

    act(() => {
      result.current.goToPreviousPage();
    });

    expect(result.current.currentPageNumber).toBe(1);
    expect(result.current.superAfterKey).toBeUndefined();
    expect(result.current.hasPrev).toBe(false);
    expect(result.current.hasNext).toBe(true);

    act(() => {
      result.current.goToNextPage();
    });
    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPageNumber).toBe(3);
    expect(result.current.superAfterKey).toBe("item-9"); // afterKey changed, so fetch new items
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(true);
    expect(result.current.superHasPrev).toBe(true);
    expect(result.current.superHasNext).toBe(false);

    const { items: items2, afterKey: afterKey2 } = fetchItems(
      result.current.superAfterKey,
      SUPER_LIMIT,
    );

    expect(items2).toHaveLength(SUPER_LIMIT);
    expect(afterKey2).toBe("item-19");

    act(() => {
      result.current.superOnAfterKeyReceived(afterKey2);
    });

    expect(result.current.currentPageNumber).toBe(3);
    expect(result.current.superAfterKey).toBe("item-9");
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(true);
    expect(result.current.superHasPrev).toBe(true);
    expect(result.current.superHasNext).toBe(true);

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPageNumber).toBe(4);
    expect(result.current.superAfterKey).toBe("item-9");
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(true);
    expect(result.current.superHasPrev).toBe(true);
    expect(result.current.superHasNext).toBe(true);

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPageNumber).toBe(5);
    expect(result.current.superAfterKey).toBe("item-19"); // afterKey changed, so fetch new items
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(true);
    expect(result.current.superHasPrev).toBe(true);
    expect(result.current.superHasNext).toBe(false);

    const { items: items3, afterKey: afterKey3 } = fetchItems(
      result.current.superAfterKey,
      SUPER_LIMIT,
    );

    expect(items3).toHaveLength(SUPER_LIMIT);
    expect(afterKey3).toBe("item-29");

    act(() => {
      result.current.superOnAfterKeyReceived(afterKey3);
    });

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPageNumber).toBe(6);
    expect(result.current.superAfterKey).toBe("item-19");
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(true);
    expect(result.current.superHasPrev).toBe(true);
    expect(result.current.superHasNext).toBe(true);

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPageNumber).toBe(7);
    expect(result.current.superAfterKey).toBe("item-29");
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(true);
    expect(result.current.superHasPrev).toBe(true);
    expect(result.current.superHasNext).toBe(false);

    const { items: items4, afterKey: afterKey4 } = fetchItems(
      result.current.superAfterKey,
      SUPER_LIMIT,
    );

    expect(items4).toHaveLength(9);
    expect(afterKey4).toBeUndefined();

    act(() => {
      result.current.superOnAfterKeyReceived(afterKey4);
    });

    expect(result.current.currentPageNumber).toBe(7);
    expect(result.current.superAfterKey).toBe("item-29");
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(true);
    expect(result.current.superHasPrev).toBe(true);
    expect(result.current.superHasNext).toBe(false);

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPageNumber).toBe(8);
    expect(result.current.superAfterKey).toBe("item-29");
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(false);
    expect(result.current.superHasPrev).toBe(true);
    expect(result.current.superHasNext).toBe(false);

    // Ensure that we cannot go beyond the last page
    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPageNumber).toBe(8);
    expect(result.current.superAfterKey).toBe("item-29");
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(false);
    expect(result.current.superHasPrev).toBe(true);
    expect(result.current.superHasNext).toBe(false);

    // But we can go back
    act(() => {
      result.current.goToPreviousPage();
    });

    expect(result.current.currentPageNumber).toBe(7);
    expect(result.current.superAfterKey).toBe("item-29");
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(true);
    expect(result.current.superHasPrev).toBe(true);
    expect(result.current.superHasNext).toBe(false);

    act(() => {
      result.current.goToPreviousPage();
    });

    expect(result.current.currentPageNumber).toBe(6);
    expect(result.current.superAfterKey).toBe("item-19");
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(true);
    expect(result.current.superHasPrev).toBe(true);
    expect(result.current.superHasNext).toBe(true);

    // TODO: add tests for `onChangeLimit`
    // TODO: add tests for `resetPagination`
  });
});
