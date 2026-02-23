import { GoalPausedReasonsType } from "../../../../domain/goals/GoalPausedReasons.js";

/**
 * PauseGoalRequest
 *
 * Request model for goal pause endpoint.
 * Goal must be in DOING status to be paused.
 */
export interface PauseGoalRequest {
  readonly goalId: string;
  readonly reason: GoalPausedReasonsType;
  readonly note?: string;
}
