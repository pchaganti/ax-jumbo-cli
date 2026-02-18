/**
 * AddRelationResponse
 *
 * Response model for adding a relation.
 * Returns the relation ID after successful creation (or idempotent match).
 */
export interface AddRelationResponse {
  readonly relationId: string;
}
