import { generateCategoryPagesCommand } from "./generateCategoryPages";
import { generateHomePageCommand } from "./generateHomePage";
import { generateRootCategoriesCommand } from "./generateRootCategories";
import { generateSubCategoriesCommand } from "./generateSubCategories";
import { viewCategoryTreeCommand } from "./viewCategoryTree";

export const commands = [
  generateHomePageCommand,
  generateRootCategoriesCommand,
  generateSubCategoriesCommand,
  viewCategoryTreeCommand,
  generateCategoryPagesCommand,
];
