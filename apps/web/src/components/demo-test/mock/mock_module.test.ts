import fs from "fs";
import { readFile } from "./mock_module";

// モジュール全体をモックする
jest.mock("fs");
// モック関数を取得する。TypeScriptの場合はjest.mockedを使う
const mockFs = jest.mocked(fs);
mockFs.readFileSync.mockReturnValue("This is a mock file");

it("readFileがデータを返却する", () => {
  const data = readFile("test.txt");
  expect(data).toBe("This is a mock file");
});
