// 非同期のテスト
import { delay } from "./async_func";

// 配列をグループ化する関数
describe("delay function", () => {
  jest.useFakeTimers();

  it("resolves with the message after the specified time", async () => {
    const promise = delay("Hello", 1000);
    jest.advanceTimersByTime(1000);
    await expect(promise).resolves.toBe("Hello");
  });

  it("rejects when time is negative", async () => {
    await expect(delay("Hello", -1)).rejects.toThrow("timeは0以上で指定してください");
  });

  it("resolves immediately when time is 0", async () => {
    const promise = delay("Instant", 0);
    jest.advanceTimersByTime(0);
    await expect(promise).resolves.toBe("Instant");
  });

  it("does not resolve before the specified time", async () => {
    const promise = delay("Not yet", 2000);
    jest.advanceTimersByTime(1999);
    const result = jest.fn();
    promise.then(result);
    expect(result).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    await promise;
    expect(result).toHaveBeenCalledWith("Not yet");
  });
});