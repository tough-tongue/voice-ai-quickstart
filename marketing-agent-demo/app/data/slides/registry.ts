/**
 * Slide deck registry.
 * Validates all category files at import time — catches schema drift early.
 */

import { validateCategoryFile, type Category, type CategoryFile } from "./schema";
import propertyTypeA from "./property-type-a.json";
import propertyTypeB from "./property-type-b.json";
import amenities from "./amenities.json";

// Validate at import time (build-time catch)
const RAW_CATEGORIES: CategoryFile[] = [
  validateCategoryFile(propertyTypeA),
  validateCategoryFile(propertyTypeB),
  validateCategoryFile(amenities),
];

export const SLIDE_CATEGORIES: Record<string, CategoryFile> = Object.fromEntries(
  RAW_CATEGORIES.map((c) => [c.meta.id, c]),
);

export const CATEGORY_LIST: Category[] = RAW_CATEGORIES.map((c) => c.meta);

export function getCategory(id: string): CategoryFile | null {
  return SLIDE_CATEGORIES[id] ?? null;
}
