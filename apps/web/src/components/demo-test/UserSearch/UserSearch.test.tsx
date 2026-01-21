import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import { UserSearch } from "./UserSearch";

// axiosモジュール全体をモック化
jest.mock("axios");

// モック化されたaxiosを型安全に使用するための設定
const mockedAxios = jest.mocked(axios);

describe("UserSearch", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("入力フィールドに値を入力し、検索ボタンをクリックすると適切なAPIリクエストが発生する", async () => {
    // モックデータの設定
    const mockUser = { id: 1, name: "John Doe" };
    mockedAxios.get.mockResolvedValue({ data: mockUser });

    // コンポーネントのレンダリング
    render(<UserSearch />);

    // 入力フィールドを取得し、値を入力
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "john" } });

    // 検索ボタンをクリック
    const button = screen.getByRole("button", { name: /search/i });
    fireEvent.click(button);

    // APIが正しいクエリパラメータで呼び出されたことを確認
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith("/api/users?query=john");
    });
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  it("APIから取得したユーザー情報が正しく画面に表示される", async () => {
    // モックデータの設定
    const mockUser = { id: 1, name: "John Doe" };
    mockedAxios.get.mockResolvedValue({ data: mockUser });

    // コンポーネントのレンダリング
    render(<UserSearch />);

    // 検索を実行
    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /search/i });

    fireEvent.change(input, { target: { value: "john" } });
    fireEvent.click(button);

    // ユーザー名が表示されるまで待機し、確認
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  it("APIがエラーを返した場合、エラーメッセージが表示される", async () => {
    const errorMessage = "Network Error";
    mockedAxios.get.mockRejectedValue(new Error(errorMessage));

    render(<UserSearch />);

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /search/i });

    fireEvent.change(input, { target: { value: "john" } });
    fireEvent.click(button);

    await waitFor(() => {
      const errorElement = screen.getByTestId("error-message");
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent(errorMessage);
    });

    // ユーザー情報が表示されていないことを確認
    expect(screen.queryByText(/john doe/i)).not.toBeInTheDocument();
  });

  it("初期状態ではユーザー情報とエラーメッセージが表示されていない", () => {
    render(<UserSearch />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
    expect(screen.queryByText(/john doe/i)).not.toBeInTheDocument();
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
  });
});
