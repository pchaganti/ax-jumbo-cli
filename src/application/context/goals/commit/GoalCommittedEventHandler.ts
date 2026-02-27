import { IEventHandler } from "../../../messaging/IEventHandler.js";
import { BaseEvent } from "../../../../domain/BaseEvent.js";
import { GoalCommittedEvent } from "../../../../domain/goals/commit/GoalCommittedEvent.js";
import { IGoalCommittedProjector } from "./IGoalCommittedProjector.js";

/**
 * Event handler for GoalCommittedEvent.
 *
 * Application layer handler that orchestrates projection updates
 * when a goal is committed. Subscribes to GoalCommittedEvent via event bus.
 */
export class GoalCommittedEventHandler implements IEventHandler {
  constructor(private readonly projector: IGoalCommittedProjector) {}

  async handle(event: BaseEvent): Promise<void> {
    const goalCommittedEvent = event as GoalCommittedEvent;
    await this.projector.applyGoalCommitted(goalCommittedEvent);
  }
}
