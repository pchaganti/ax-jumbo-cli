/**
 * CommitGoalRequest
 *
 * Request model for goal commit endpoint.
 * Initiates the commit flow to transition a goal from "in-refinement" to "refined" status.
 */
export interface CommitGoalRequest {
  readonly goalId: string;
}
