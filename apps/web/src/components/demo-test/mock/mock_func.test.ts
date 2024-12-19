// mock関数を作成する

it("mock function", () => {
  const mock = jest.fn();
  expect(mock).not.toHaveBeenCalled();
  mock();
  expect(mock).toHaveBeenCalled();
});

it("mockImplement", () => {
  const mock = jest.fn().mockImplementation(() => "Hello");
  expect(mock()).toBe("Hello");
});
