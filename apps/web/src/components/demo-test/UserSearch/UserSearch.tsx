/**
 * 演習
 * 次の内容でテストを作成してください
 * 1. 入力フィールドに値を入力し、検索ボタンをクリックすると適切なAPIリクエストが発生する
 * 2. APIから取得したユーザー情報が正しく画面に表示される
 */

import axios from "axios";
import { useState } from "react";

interface User {
  id: number;
  name: string;
}

export const UserSearch = () => {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    try {
      setError(null);
      const { data } = await axios.get<User>(`/api/users?query=${query}`);
      setUser(data);
    } catch (err) {
      setUser(null);
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={search}>Search</button>
      {error && <div data-testid="error-message">{error}</div>}
      {user && <div>{user.name}</div>}
    </div>
  );
};
