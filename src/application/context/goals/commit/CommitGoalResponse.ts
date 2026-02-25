/**
 * CommitGoalResponse
 *
 * Response model for goal commit requests.
 * Returns minimal data after successful commit (token optimization).
 */
export interface CommitGoalResponse {
  readonly goalId: string;
  readonly status: string;
}
