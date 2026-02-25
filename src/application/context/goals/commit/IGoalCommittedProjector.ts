import { GoalCommittedEvent } from "../../../../domain/goals/commit/GoalCommittedEvent.js";

/**
 * Port interface for projecting GoalCommittedEvent to the read model.
 * Used by GoalCommittedEventHandler to update the projection store.
 */
export interface IGoalCommittedProjector {
  applyGoalCommitted(event: GoalCommittedEvent): Promise<void>;
}
