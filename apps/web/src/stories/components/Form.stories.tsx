import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import { userEvent, within } from "@storybook/testing-library";
import Form from "./Form";

/**
 * Formコンポーネントのストーリー設定
 * - タイトル: Components/Form
 * - レイアウト: 中央寄せ
 * - autodocs: コンポーネントのドキュメントを自動生成
 */
const meta = {
  title: "Components/Form",
  component: Form,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なフォームの動作テスト
 * - 入力フィールドの初期状態確認
 * - テキスト入力のテスト
 * - フォーム送信のテスト
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    // canvasElementから要素を検索するためのユーティリティを取得
    const canvas = within(canvasElement);

    // フォーム要素の取得
    // aria-roleとプレースホルダーテキストを使用してアクセシブルに要素を特定
    const input = canvas.getByPlaceholderText("Enter text");
    const submitButton = canvas.getByRole("button", { name: /submit/i });

    // 初期状態のテスト
    // 入力フィールドが空であることを確認
    await expect(input).toHaveValue("");
    // 送信ボタンが有効であることを確認
    await expect(submitButton).toBeEnabled();

    // ユーザーの入力をシミュレート
    await userEvent.type(input, "Hello, Storybook!");
    // 入力値が正しく反映されていることを確認
    await expect(input).toHaveValue("Hello, Storybook!");

    // フォーム送信のテスト
    // window.alertをモック化して、送信時の動作を確認
    const alertMock = fn();
    window.alert = alertMock;

    // 送信ボタンクリックをシミュレート
    await userEvent.click(submitButton);

    // alertが正しい値で呼び出されたことを確認
    expect(alertMock).toHaveBeenCalledWith("submitted: Hello, Storybook!");
  },
};

/**
 * 空入力での送信テスト
 * - 何も入力せずに送信した場合の動作確認
 */
export const EmptySubmission: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const submitButton = canvas.getByRole("button", { name: /submit/i });
    const alertMock = fn();
    window.alert = alertMock;

    // 空の状態で送信
    await userEvent.click(submitButton);

    // 空文字列で送信されることを確認
    expect(alertMock).toHaveBeenCalledWith("submitted: ");
  },
};

/**
 * 長文入力のテスト
 * - 長いテキストを入力した際の動作確認
 * - 入力フィールドが長文を正しく処理できることを確認
 */
export const LongInput: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText("Enter text");
    const longText =
      "This is a very long input text to test how the form handles lengthy content...";

    // 長文の入力をシミュレート
    await userEvent.type(input, longText);
    // 長文が正しく入力されていることを確認
    await expect(input).toHaveValue(longText);
  },
};
