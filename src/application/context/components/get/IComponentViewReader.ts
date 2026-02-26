/**
 * Port interface for listing components from the projection store.
 * Used by ListComponentsQueryHandler to retrieve component list with filtering.
 */

import { ComponentView } from "../ComponentView.js";
import { ComponentSearchCriteria } from "../search/ComponentSearchCriteria.js";

export type ComponentStatusFilter = "active" | "deprecated" | "removed" | "all";

export interface IComponentViewReader {
  /**
   * Retrieves all components, optionally filtered by status.
   * @param status - Filter by status, or "all" for all components
   * @returns Array of component views ordered by name
   */
  findAll(status?: ComponentStatusFilter): Promise<ComponentView[]>;

  /**
   * Retrieves components by their IDs.
   * @param ids - Array of component IDs to retrieve
   * @returns Array of component views ordered by name
   */
  findByIds(ids: string[]): Promise<ComponentView[]>;

  /**
   * Searches components by criteria with AND logic.
   * @param criteria - Search filters (name substring, type exact, status exact, query across description/responsibility)
   * @returns Array of matching component views ordered by name
   */
  search(criteria: ComponentSearchCriteria): Promise<ComponentView[]>;
}
