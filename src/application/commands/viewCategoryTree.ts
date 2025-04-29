import { Category } from "../../domain/types";
import { Command } from "../types";
import { readCategories } from "../util/category";

export const viewCategoryTreeCommand: Command<void> = {
  name: "カテゴリツリーを閲覧する",
  description: "現在登録されているカテゴリ構造をツリー表示します",
  askParams: async () => {
    return;
  },
  execute: async () => {
    const categories = readCategories();

    const categoryMap = new Map<string, Category>();
    for (const category of categories) {
      categoryMap.set(category.id, category);
    }

    const roots = categories.filter((c) => !c.parentId);

    const printTree = (parent: Category, depth: number) => {
      console.info(`${"  ".repeat(depth)}- ${parent.name}`);
      const children = categories.filter((c) => c.parentId === parent.id);
      for (const child of children) {
        printTree(child, depth + 1);
      }
    };

    for (const root of roots) {
      printTree(root, 0);
    }
  },
};
