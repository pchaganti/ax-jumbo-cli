/**
 * ResumeGoalRequest
 *
 * Request model for goal resume endpoint.
 * Goal must be in PAUSED status to be resumed.
 */
export interface ResumeGoalRequest {
  readonly goalId: string;
  readonly note?: string;
}
