import axios from "axios";
import Users from "./mock_axios";

// axiosモジュール全体をモック化
jest.mock("axios");

// モック化されたaxiosを型安全に使用するための設定
const mockedAxios = jest.mocked(axios);

describe("Users class", () => {
  // 各テストの前にモックをリセット
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("all()メソッドが正常にユーザーデータを取得できること", async () => {
    // モックデータの設定
    const mockUsers = [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
    ];

    // axiosのgetメソッドが解決するPromiseの値を設定
    mockedAxios.get.mockResolvedValue({ data: mockUsers });

    // Users.all()メソッドを呼び出し
    const result = await Users.all();

    // 期待される結果の検証
    expect(result).toEqual(mockUsers);

    // axiosのgetメソッドが正しく呼び出されたことを確認
    expect(mockedAxios.get).toHaveBeenCalledWith("/users.json");
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  it("all()メソッドがエラー時に例外をスローすること", async () => {
    // エラーメッセージの設定
    const errorMessage = "Network Error";

    // axiosのgetメソッドが拒否するPromiseの値を設定
    mockedAxios.get.mockRejectedValue(new Error(errorMessage));

    // Users.all()メソッドの呼び出しが例外をスローすることを期待
    await expect(Users.all()).rejects.toThrow(errorMessage);

    // axiosのgetメソッドが正しく呼び出されたことを確認
    expect(mockedAxios.get).toHaveBeenCalledWith("/users.json");
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });
});
