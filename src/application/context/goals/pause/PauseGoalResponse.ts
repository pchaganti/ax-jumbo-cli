/**
 * PauseGoalResponse
 *
 * Response model for goal pause requests.
 * Returns goal details after successful pause.
 */
export interface PauseGoalResponse {
  readonly goalId: string;
  readonly objective: string;
  readonly status: string;
  readonly reason: string;
}
