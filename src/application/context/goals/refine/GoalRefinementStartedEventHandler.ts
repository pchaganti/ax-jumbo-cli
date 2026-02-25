import { IEventHandler } from "../../../messaging/IEventHandler.js";
import { BaseEvent } from "../../../../domain/BaseEvent.js";
import { GoalRefinementStartedEvent } from "../../../../domain/goals/refine/GoalRefinementStartedEvent.js";
import { IGoalRefinedProjector } from "./IGoalRefinedProjector.js";

/**
 * Event handler for GoalRefinementStartedEvent.
 *
 * Application layer handler that orchestrates projection updates
 * when goal refinement starts. Subscribes to GoalRefinementStartedEvent via event bus.
 */
export class GoalRefinementStartedEventHandler implements IEventHandler {
  constructor(private readonly projector: IGoalRefinedProjector) {}

  async handle(event: BaseEvent): Promise<void> {
    const goalRefinementStartedEvent = event as GoalRefinementStartedEvent;
    await this.projector.applyGoalRefinementStarted(goalRefinementStartedEvent);
  }
}
