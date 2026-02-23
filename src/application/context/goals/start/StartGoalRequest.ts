/**
 * StartGoalRequest
 *
 * Request model for goal start endpoint.
 * Goal must be in REFINED status to be started.
 */
export interface StartGoalRequest {
  readonly goalId: string;
}
