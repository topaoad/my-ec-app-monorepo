import { Calculator } from "./mock_spy";

// Spyを使ってメソッドの呼び出しを監視する
it("Spyを使ってメソッドの呼び出しを監視する", () => {
  const calculator = new Calculator();
  const spy = jest.spyOn(calculator, "sum");
  expect(calculator.sum(1, 2)).toBe(3);
  expect(spy).toHaveBeenCalled();
  expect(spy).toHaveBeenCalledWith(1, 2);
  spy.mockRestore();
});
