import "@testing-library/jest-dom";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AsyncComponent from "./AsyncComponent";

describe("AsyncComponent", () => {
  const user = userEvent.setup({ delay: null }); // ユーザーイベントの遅延を無効化

  beforeEach(() => {
    jest.useFakeTimers({ legacyFakeTimers: true }); // legacyモードを使用
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it("初期テキストが表示されること", () => {
    render(<AsyncComponent />);
    expect(screen.getByText("Initial text")).toBeInTheDocument();
  });

  it("ボタンクリック後にローディングテキストが表示されること", async () => {
    render(<AsyncComponent />);

    // ボタンが表示されるまで待機
    const button = await screen.findByText("Update Text");

    await act(async () => {
      await user.click(button);
    });

    // ローディングテキストを確認
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  }, 10000); // タイムアウトを延長

  it("2秒後に更新されたテキストが表示されること", async () => {
    render(<AsyncComponent />);

    // ボタンが表示されるまで待機
    const button = await screen.findByText("Update Text");

    await act(async () => {
      await user.click(button);
    });

    // ローディング状態を確認
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // タイマーを進める
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // 更新後のテキストを確認
    expect(screen.getByText("Updated text")).toBeInTheDocument();
  }, 10000); // タイムアウトを延長
});