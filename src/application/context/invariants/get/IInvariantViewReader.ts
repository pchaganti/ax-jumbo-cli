/**
 * Port interface for listing invariants from the projection store.
 * Used by ListInvariantsQueryHandler to retrieve invariant list.
 */

import { InvariantView } from "../InvariantView.js";

export interface IInvariantViewReader {
  /**
   * Retrieves all active invariants.
   * @returns Array of invariant views ordered by creation date
   */
  findAll(): Promise<InvariantView[]>;

  /**
   * Retrieves invariants by their IDs.
   * @param ids - Array of invariant IDs to retrieve
   * @returns Array of invariant views ordered by creation date (oldest first)
   */
  findByIds(ids: string[]): Promise<InvariantView[]>;
}
