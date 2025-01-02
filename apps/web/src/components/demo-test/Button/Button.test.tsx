import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";

describe("Buttonコンポーネント", () => {
  it("ボタンが正しくレンダリングされる", () => {
    const mockClick = jest.fn();
    render(<Button label="テストボタン" onClick={mockClick} />);

    const button = screen.getByRole("button", { name: "テストボタン" });
    expect(button).toBeInTheDocument();
  });

  it("ラベルが正しく表示される", () => {
    const mockClick = jest.fn();
    render(<Button label="クリックしてください" onClick={mockClick} />);

    expect(screen.getByText("クリックしてください")).toBeInTheDocument();
  });

  it("クリックイベントが正しく発火する", () => {
    const mockClick = jest.fn();
    render(<Button label="クリック" onClick={mockClick} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it("複数回クリックした場合、その回数分イベントが発火する", () => {
    const mockClick = jest.fn();
    render(<Button label="クリック" onClick={mockClick} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockClick).toHaveBeenCalledTimes(3);
  });
});
