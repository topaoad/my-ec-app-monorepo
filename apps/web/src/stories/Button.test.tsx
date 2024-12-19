import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { Button, ButtonProps } from "./Button";

describe("Buttonコンポーネントのテスト", () => {
  const renderButton = (props: ButtonProps) => {
    return render(<Button {...props} />);
  };

  it("正しくレンダリングされる", () => {
    renderButton({ label: "Test" });
    const buttonElement = screen.getByRole("button", { name: "Test" });
    expect(buttonElement).toBeInTheDocument();
  });

  it("ラベルが正しく表示される", () => {
    renderButton({ label: "Click me" });
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("primaryプロップが正しく適用される", () => {
    renderButton({ label: "Primary Button", primary: true });
    const buttonElement = screen.getByText("Primary Button");
    expect(buttonElement).toHaveClass("storybook-button--primary");
  });

  it("sizeプロップが正しく適用される", () => {
    renderButton({ label: "Large Button", size: "large" });
    const buttonElement = screen.getByText("Large Button");
    expect(buttonElement).toHaveClass("storybook-button--large");
  });

  it("backgroundColorプロップが正しく適用される", () => {
    renderButton({ label: "Colored Button", backgroundColor: "red" });
    const buttonElement = screen.getByText("Colored Button");
    expect(buttonElement).toHaveStyle("background-color: red");
  });

  it("クリック時にonClickイベントハンドラがトリガーされる", () => {
    const handleClick = jest.fn();
    renderButton({ label: "Click me", onClick: handleClick });
    const buttonElement = screen.getByText("Click me");
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // it("追加のpropsが正しく適用される", () => {
  //   renderButton({ label: "Custom Button", "data-testid": "custom-button" });
  //   const buttonElement = screen.getByTestId("custom-button");
  //   expect(buttonElement).toBeInTheDocument();
  // });
});
