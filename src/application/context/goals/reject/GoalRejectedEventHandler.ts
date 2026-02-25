import { IEventHandler } from "../../../messaging/IEventHandler.js";
import { BaseEvent } from "../../../../domain/BaseEvent.js";
import { GoalRejectedEvent } from "../../../../domain/goals/reject/GoalRejectedEvent.js";
import { IGoalRejectedProjector } from "./IGoalRejectedProjector.js";

/**
 * Event handler for GoalRejectedEvent.
 *
 * Application layer handler that orchestrates projection updates
 * when a goal is rejected. Subscribes to GoalRejectedEvent via event bus.
 */
export class GoalRejectedEventHandler implements IEventHandler {
  constructor(private readonly projector: IGoalRejectedProjector) {}

  async handle(event: BaseEvent): Promise<void> {
    const goalRejectedEvent = event as GoalRejectedEvent;
    await this.projector.applyGoalRejected(goalRejectedEvent);
  }
}
