import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import AsyncComponent from "./AsyncComponent";

describe("AsyncComponent", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("初期テキストが表示されること", () => {
    render(<AsyncComponent />);
    expect(screen.getByText("Initial text")).toBeInTheDocument();
  });

  it("ボタンクリック後にローディングテキストが表示されること", () => {
    render(<AsyncComponent />);
    const button = screen.getByText("Update Text");
    fireEvent.click(button);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("2秒後に更新されたテキストが表示されること", async () => {
    render(<AsyncComponent />);
    const button = screen.getByText("Update Text");
    fireEvent.click(button);

    // タイマーを進める ※waitFor関数の第二引数で{ timeout: 3000 }のように設定する際は不要
    // jest.advanceTimersByTime(2000);

    // 更新されたテキストが表示されるのを待つ
    await waitFor(() => {
      expect(screen.getByText("Updated text")).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});