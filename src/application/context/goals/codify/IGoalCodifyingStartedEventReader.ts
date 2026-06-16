import { GoalEvent } from "../../../../domain/goals/EventIndex.js";

/**
 * Port interface for reading goal events to rehydrate aggregate.
 * Used by CodifyGoalCommandHandler to load event history.
 */
export interface IGoalCodifyingStartedEventReader {
  readStream(streamId: string): Promise<GoalEvent[]>;
}
