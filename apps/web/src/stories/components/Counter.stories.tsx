import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/test";
import Counter from "./Counter";

/**
 * Counterコンポーネントのストーリー設定
 * - コンポーネント名とパスの定義
 * - レイアウトは中央寄せ
 * - 自動ドキュメント生成を有効化
 */
const meta = {
  title: "Components/Counter",
  component: Counter,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  // コンポーネントのプロパティ定義
  argTypes: {
    initialCount: {
      control: { type: "number" },
      description: "カウンターの初期値",
    },
  },
} satisfies Meta<typeof Counter>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト値（initialCount未指定）での表示と操作テスト
 * - 初期値が0であることを確認
 * - インクリメント・デクリメントボタンの動作確認
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 初期表示の確認
    const countDisplay = canvas.getByText("Count: 0");
    expect(countDisplay).toBeInTheDocument();

    // ボタンの取得
    const incrementButton = canvas.getByText("＋");
    const decrementButton = canvas.getByText("ー");

    // インクリメントのテスト
    await userEvent.click(incrementButton);
    expect(canvas.getByText("Count: 1")).toBeInTheDocument();

    // デクリメントのテスト
    await userEvent.click(decrementButton);
    expect(canvas.getByText("Count: 0")).toBeInTheDocument();
  }
};

/**
 * 初期値を指定した場合のテスト
 * - 指定した初期値（10）で表示されることを確認
 * - カウント操作の動作確認
 */
export const WithInitialCount: Story = {
  args: {
    initialCount: 10,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 初期値の確認
    const countDisplay = canvas.getByText("Count: 10");
    expect(countDisplay).toBeInTheDocument();

    // ボタンの取得と操作テスト
    const incrementButton = canvas.getByText("＋");
    const decrementButton = canvas.getByText("ー");

    // インクリメント操作
    await userEvent.click(incrementButton);
    expect(canvas.getByText("Count: 11")).toBeInTheDocument();

    // デクリメント操作
    await userEvent.click(decrementButton);
    expect(canvas.getByText("Count: 10")).toBeInTheDocument();
  }
};

/**
 * 連続操作のテスト
 * - 複数回の増減操作を行い、正しくカウントされることを確認
 */
export const MultipleOperations: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const incrementButton = canvas.getByText("＋");
    const decrementButton = canvas.getByText("ー");

    // 複数回のインクリメント
    await userEvent.click(incrementButton);
    await userEvent.click(incrementButton);
    await userEvent.click(incrementButton);
    expect(canvas.getByText("Count: 3")).toBeInTheDocument();

    // 複数回のデクリメント
    await userEvent.click(decrementButton);
    await userEvent.click(decrementButton);
    expect(canvas.getByText("Count: 1")).toBeInTheDocument();
  }
};