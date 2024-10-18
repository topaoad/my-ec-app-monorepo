// mock関数が呼ばれたかどうかを確認する

it("mock関数が呼ばれたかどうかを確認する", () => {
  const mock = jest.fn();
  expect(mock).not.toHaveBeenCalled();
  mock();
  expect(mock).toHaveBeenCalled();
});

it("mock関数が２回呼ばれる", () => {
  const mock = jest.fn();
  mock();
  mock();
  expect(mock).toHaveBeenCalledTimes(2);
});

it("mock関数に引数を渡して呼ばれる", () => {
  const mock = jest.fn();
  mock("Hello");
  expect(mock).toHaveBeenCalledWith("Hello");
});
