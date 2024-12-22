import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Form from "./Form";

describe("Formコンポーネントのテスト", () => {
  it("初期状態で入力フィールドが空であること", () => {
    render(<Form />);
    const inputElement = screen.getByPlaceholderText(
      "Enter text",
    ) as HTMLInputElement;
    expect(inputElement.value).toBe("");
    expect(inputElement).toBeInTheDocument();
  });

  it("テキスト入力後にサブミットが正しく動作すること", () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    render(<Form />);

    const inputElement = screen.getByPlaceholderText("Enter text");
    const submitButton = screen.getByText("Submit");

    // テキストを入力
    fireEvent.change(inputElement, { target: { value: "テストテキスト" } });

    // フォームをサブミット
    fireEvent.click(submitButton);

    // アラートが正しい内容で呼び出されたことを確認
    expect(alertMock).toHaveBeenCalledWith("submitted: テストテキスト");

    // モックをクリーンアップ
    alertMock.mockRestore();
  });
});
