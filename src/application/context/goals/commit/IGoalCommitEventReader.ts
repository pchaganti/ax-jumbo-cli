import { BaseEvent } from "../../../../domain/BaseEvent.js";

/**
 * Port interface for reading goal events to rehydrate aggregate.
 * Used by CommitGoalCommandHandler to load event history.
 */
export interface IGoalCommitEventReader {
  readStream(streamId: string): Promise<BaseEvent[]>;
}
