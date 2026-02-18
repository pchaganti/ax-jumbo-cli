/**
 * RefineGoalRequest
 *
 * Request model for goal refinement endpoint.
 * Goal must be in TO_DO status to be refined.
 */
export interface RefineGoalRequest {
  readonly goalId: string;
}
