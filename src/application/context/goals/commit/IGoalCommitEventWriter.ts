import { BaseEvent } from "../../../../domain/BaseEvent.js";
import { AppendResult } from "../../../persistence/IEventStore.js";

/**
 * Port interface for writing GoalCommittedEvent to the event store.
 * Used by CommitGoalCommandHandler to persist domain events.
 */
export interface IGoalCommitEventWriter {
  append(event: BaseEvent & Record<string, any>): Promise<AppendResult>;
}
