/**
 * RefineGoalResponse
 *
 * Response model for goal refinement requests.
 * Returns minimal data after successful refinement (token optimization).
 */
export interface RefineGoalResponse {
  readonly goalId: string;
  readonly status: string;
}
