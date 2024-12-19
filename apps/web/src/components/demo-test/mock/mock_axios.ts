/**
 * 【演習】
 * 以下のUsersクラスのテストを作成してください
 *
 * 【ヒント】
 * 1. jest.mockを使用してaxiosをモック化します
 * 2. mockResolvedValueまたはmockImplementationを使用して、
 * 　　モック化したaxios.getが期待した結果を返すように設定します
 */
import axios from "axios";

class Users {
  static async all() {
    const resp = await axios.get("/users.json");
    return resp.data;
  }
}

export default Users;
