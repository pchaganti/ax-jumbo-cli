import { BaseEvent } from "../../../../domain/BaseEvent.js";
import { AppendResult } from "../../../persistence/IEventStore.js";

/**
 * Port interface for writing GoalRejectedEvent to the event store.
 * Used by RejectGoalCommandHandler to persist domain events.
 */
export interface IGoalRejectedEventWriter {
  append(event: BaseEvent & Record<string, any>): Promise<AppendResult>;
}
