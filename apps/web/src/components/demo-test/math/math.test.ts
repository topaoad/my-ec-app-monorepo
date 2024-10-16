// 例外処理のテスト

import { divide, ZeroDivisorError } from "./math";

describe("divide function", () => {
  it("should correctly divide two numbers", () => {
    expect(divide(10, 2)).toBe(5);
    expect(divide(-10, 2)).toBe(-5);
    expect(divide(10, -2)).toBe(-5);
  });

  it("should throw ZeroDivisorError when dividing by zero", () => {
    expect(() => divide(10, 0)).toThrow(ZeroDivisorError);
    expect(() => divide(10, 0)).toThrow("0で割ることはできません");
  });
});