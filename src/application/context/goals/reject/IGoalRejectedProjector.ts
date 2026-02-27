import { GoalRejectedEvent } from "../../../../domain/goals/reject/GoalRejectedEvent.js";

/**
 * Port interface for projecting GoalRejectedEvent to the read model.
 * Used by GoalRejectedEventHandler to update the projection store.
 */
export interface IGoalRejectedProjector {
  applyGoalRejected(event: GoalRejectedEvent): Promise<void>;
}
