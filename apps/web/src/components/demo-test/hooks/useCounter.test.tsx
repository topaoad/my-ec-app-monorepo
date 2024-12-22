import { act, renderHook } from "@testing-library/react";
import useCounter from "./useCounter";

describe("useCounter", () => {
  it("should initialize with the provided value", () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  it("should increment the counter", () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it("should decrement the counter", () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(-1);
  });

  it("should handle multiple increments correctly", () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.increment();
    });

    expect(result.current.count).toBe(3);
  });

  it("should handle multiple decrements correctly", () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.decrement();
      result.current.decrement();
      result.current.decrement();
    });

    expect(result.current.count).toBe(-3);
  });

  it("should handle mixed operations correctly", () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment();
      result.current.decrement();
      result.current.increment();
      result.current.increment();
    });

    expect(result.current.count).toBe(2);
  });
});