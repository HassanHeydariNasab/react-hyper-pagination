import { expect, test, describe } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useAfterKeyPagination } from "../hooks/useAfterKeyPagination";

describe("useAfterKeyPagination", () => {
  test("should work", () => {
    const ITEMS = Array.from({ length: 39 }, (_, i) => `item-${i}`);

    const LIMIT = 10;

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
      useAfterKeyPagination({ defaultLimit: LIMIT }),
    );

    expect(result.current.currentPageNumber).toBe(1);
    expect(result.current.afterKey).toBeUndefined();
    expect(result.current.hasPrev).toBe(false);
    expect(result.current.hasNext).toBe(false); // because we don't have any afterKey yet.

    const { items: items1, afterKey: afterKey1 } = fetchItems(
      result.current.afterKey,
      LIMIT,
    );

    expect(items1).toHaveLength(10);
    expect(afterKey1).toBe("item-9");

    act(() => {
      result.current.onAfterKeyReceived(afterKey1);
    });

    // still on page 1
    expect(result.current.currentPageNumber).toBe(1);
    expect(result.current.afterKey).toBeUndefined();
    expect(result.current.hasPrev).toBe(false);
    expect(result.current.hasNext).toBe(true); // but we can go to the next page.

    act(() => {
      result.current.goToNextPage();
    });

    // now we are on page 2
    expect(result.current.currentPageNumber).toBe(2);
    expect(result.current.afterKey).toBe("item-9");
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(false); // but we don't have the next afterKey yet.

    act(() => {
      result.current.goToPreviousPage();
    });

    expect(result.current.currentPageNumber).toBe(1);
    expect(result.current.afterKey).toBeUndefined();
    expect(result.current.hasPrev).toBe(false);
    expect(result.current.hasNext).toBe(true);

    act(() => {
      result.current.goToNextPage();
    });
    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPageNumber).toBe(2);
    expect(result.current.afterKey).toBe("item-9");
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(false); // we don't have the next afterKey yet.

    const { items: items2, afterKey: afterKey2 } = fetchItems(
      result.current.afterKey,
      LIMIT,
    );

    expect(items2).toHaveLength(LIMIT);
    expect(afterKey2).toBe("item-19");

    act(() => {
      result.current.onAfterKeyReceived(afterKey2);
    });

    expect(result.current.currentPageNumber).toBe(2);
    expect(result.current.afterKey).toBe("item-9");
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(true);

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPageNumber).toBe(3);
    expect(result.current.afterKey).toBe("item-19");
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(false);

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPageNumber).toBe(3);
    expect(result.current.afterKey).toBe("item-19");
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(false);

    const { items: items3, afterKey: afterKey3 } = fetchItems(
      result.current.afterKey,
      LIMIT,
    );

    expect(items3).toHaveLength(LIMIT);
    expect(afterKey3).toBe("item-29");

    act(() => {
      result.current.onAfterKeyReceived(afterKey3);
    });

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPageNumber).toBe(4);
    expect(result.current.afterKey).toBe("item-29");
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(false);

    const { items: items4, afterKey: afterKey4 } = fetchItems(
      result.current.afterKey,
      LIMIT,
    );

    expect(items4).toHaveLength(9);
    expect(afterKey4).toBeUndefined();

    act(() => {
      result.current.onAfterKeyReceived(afterKey4);
    });

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPageNumber).toBe(4);
    expect(result.current.afterKey).toBe("item-29");
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(false);

    // TODO: add tests for `onChangeLimit`
    // TODO: add tests for `resetPagination`
  });
});
