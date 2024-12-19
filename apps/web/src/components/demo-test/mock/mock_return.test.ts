// mock関数に戻り値を設定する

it("mock関数に戻り値を設定する", () => {
  const mock = jest.fn().mockReturnValue("Hello");
  expect(mock()).toBe("Hello");
});

it("mock関数に非同期な戻り値を設定する", async () => {
  const mock = jest.fn().mockResolvedValue("Hello");
  await expect(mock()).resolves.toBe("Hello");
});
