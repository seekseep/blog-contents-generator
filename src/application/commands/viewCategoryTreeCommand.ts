import { Category } from "../../domain/types";
import { Command } from "../types";
import { readCategories } from "../util/category";

export const viewCategoryTreeCommand: Command = {
  name: "カテゴリツリーを閲覧する",
  description: "現在登録されているカテゴリ構造をツリー表示します",
  execute: async () => {
    const categories = readCategories();

    const roots = categories.filter((c) => !c.parentName);

    const printTree = (parent: Category, depth: number) => {
      console.info(`${"  ".repeat(depth)}- ${parent.name}`);
      const children = categories.filter((c) => c.parentName === parent.name);
      for (const child of children) {
        printTree(child, depth + 1);
      }
    };

    for (const root of roots) {
      printTree(root, 0);
    }
  },
};
