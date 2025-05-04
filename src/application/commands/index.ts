import { generateCategoryPagesCommand } from "./generateCategoryPagesCommand";
import { generateHomePageCommand } from "./generateHomePageCommand";
import { generatePostPagesCommand } from "./generatePostPagesCommand";
import { generateRootCategoriesCommand } from "./generateRootCategoriesCommand";
import { generateSectionsPagesCommand } from "./generateSectionsCommand";
import { generateSubCategoriesCommand } from "./generateSubCategoriesCommand";
import { viewCategoryTreeCommand } from "./viewCategoryTreeCommand";

export const commands = [
  generateCategoryPagesCommand,
  generateHomePageCommand,
  generatePostPagesCommand,
  generateRootCategoriesCommand,
  generateSectionsPagesCommand,
  generateSubCategoriesCommand,
  viewCategoryTreeCommand,
];
