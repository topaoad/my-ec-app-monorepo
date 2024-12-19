import fs from "fs";

export function readFile(path: string) {
  const data = fs.readFileSync(path, {
    encoding: "utf-8",
  });
  return data;
}
