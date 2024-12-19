/**
 * 【演習】
 *  1. `addItem`メソッドが、アイテムをリストに追加できることを確認するテストケース
 *  2. `removeItem`メソッドが、アイテムをリストから削除できることを確認するテストケース
 *  3. `removeItem`メソッドが、存在しないアイテムの削除を試みたときにエラーをスローすることを確認するテストケース
 */

export class ShoppingList {
  public list: string[];

  constructor() {
    this.list = [];
  }

  addItem(item: string): void {
    this.list.push(item);
  }

  removeItem(item: string): void {
    const index = this.list.indexOf(item);
    if (index === -1) {
      throw new Error(`アイテム: ${item} は存在しません`);
    }
    this.list.splice(index, 1);
  }
}
