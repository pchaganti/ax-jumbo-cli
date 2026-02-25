import { GoalRefinedEvent } from "../../../../domain/goals/refine/GoalRefinedEvent.js";
import { GoalRefinementStartedEvent } from "../../../../domain/goals/refine/GoalRefinementStartedEvent.js";

/**
 * Port interface for projecting GoalRefinedEvent and GoalRefinementStartedEvent to the read model.
 * Used by event handlers to update the projection store.
 */
export interface IGoalRefinedProjector {
  applyGoalRefined(event: GoalRefinedEvent): Promise<void>;
  applyGoalRefinementStarted(event: GoalRefinementStartedEvent): Promise<void>;
}
