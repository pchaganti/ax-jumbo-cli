/**
 * Port interface for listing guidelines from the projection store.
 * Used by ListGuidelinesQueryHandler to retrieve guideline list with filtering.
 */

import { GuidelineView } from "../GuidelineView.js";

export interface IGuidelineViewReader {
  /**
   * Retrieves all active guidelines, optionally filtered by category.
   * @param category - Optional filter by category
   * @returns Array of guideline views ordered by category and creation date
   */
  findAll(category?: string): Promise<GuidelineView[]>;

  /**
   * Retrieves guidelines by their IDs.
   * @param ids - Array of guideline IDs to retrieve
   * @returns Array of guideline views ordered by creation date (newest first)
   */
  findByIds(ids: string[]): Promise<GuidelineView[]>;
}
