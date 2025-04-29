import { generateRootCategoriesCommand } from "./generateRootCategories";
import { generateSiteSummaryCommand } from "./generateSiteSummary";
import { generateSubCategoriesCommand } from "./generateSubCategories";
import { viewCategoryTreeCommand } from "./viewCategoryTree";

export const commands = [
  generateSiteSummaryCommand,
  generateRootCategoriesCommand,
  generateSubCategoriesCommand,
  viewCategoryTreeCommand,
];
