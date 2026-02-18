/**
 * UpdateGoalProgressRequest
 *
 * Request model for goal progress update endpoint.
 */
export interface UpdateGoalProgressRequest {
  readonly goalId: string;
  readonly taskDescription: string;
}
