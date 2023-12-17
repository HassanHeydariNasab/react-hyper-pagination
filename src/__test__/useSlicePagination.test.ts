import { expect, test, describe } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useSlicePagination } from "../hooks/useSlicePagination";

describe("useSlicePagination", () => {
  test("should work", () => {
    const ITEMS = Array.from({ length: 39 }, (_, i) => `item-${i}`);

    const LIMIT = 10;

    const { result } = renderHook(() =>
      useSlicePagination({ items: ITEMS, defaultLimit: LIMIT }),
    );

    expect(result.current.currentPageNumber).toBe(1);
    expect(result.current.currentPageItems).toHaveLength(LIMIT);
    expect(result.current.hasPrev).toBe(false);
    expect(result.current.hasNext).toBe(true);

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPageNumber).toBe(2);
    expect(result.current.currentPageItems).toHaveLength(LIMIT);
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(true);

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPageNumber).toBe(3);
    expect(result.current.currentPageItems).toHaveLength(LIMIT);
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(true);

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPageNumber).toBe(4);
    expect(result.current.currentPageItems).toHaveLength(9);
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(false);

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPageNumber).toBe(4);
    expect(result.current.currentPageItems).toHaveLength(9);
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(false);

    act(() => {
      result.current.goToPreviousPage();
    });

    expect(result.current.currentPageNumber).toBe(3);
    expect(result.current.currentPageItems).toHaveLength(10);
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(true);

    act(() => {
      result.current.goToPreviousPage();
    });
    act(() => {
      result.current.goToPreviousPage();
    });

    expect(result.current.currentPageNumber).toBe(1);
    expect(result.current.currentPageItems).toHaveLength(10);
    expect(result.current.hasPrev).toBe(false);
    expect(result.current.hasNext).toBe(true);

    act(() => {
      result.current.goToPreviousPage();
    });

    expect(result.current.currentPageNumber).toBe(1);
    expect(result.current.currentPageItems).toHaveLength(10);
    expect(result.current.hasPrev).toBe(false);
    expect(result.current.hasNext).toBe(true);
  });
});
