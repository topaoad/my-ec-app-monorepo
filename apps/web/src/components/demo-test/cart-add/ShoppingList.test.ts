import { ShoppingList } from "./ShoppingList";

describe("ShoppingList", () => {
  let shoppingList: ShoppingList;

  beforeEach(() => {
    shoppingList = new ShoppingList();
  });

  test("addItem メソッドがアイテムをリストに追加できること", () => {
    shoppingList.addItem("りんご");
    expect(shoppingList.list).toContain("りんご");
    expect(shoppingList.list.length).toBe(1);

    shoppingList.addItem("バナナ");
    expect(shoppingList.list).toContain("バナナ");
    expect(shoppingList.list.length).toBe(2);
  });

  test("removeItem メソッドがアイテムをリストから削除できること", () => {
    shoppingList.addItem("りんご");
    shoppingList.addItem("バナナ");
    shoppingList.removeItem("りんご");

    expect(shoppingList.list).not.toContain("りんご");
    expect(shoppingList.list).toContain("バナナ");
    expect(shoppingList.list.length).toBe(1);
  });

  test("removeItem メソッドが存在しないアイテムの削除を試みたときにエラーをスローすること", () => {
    expect(() => {
      shoppingList.removeItem("オレンジ");
    }).toThrow("アイテム: オレンジ は存在しません");
  });
});
