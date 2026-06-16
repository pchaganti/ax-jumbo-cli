import { GoalEvent } from "../../../../domain/goals/EventIndex.js";

/**
 * Port interface for reading goal events to rehydrate aggregate.
 * Used by SubmitGoalCommandHandler to load event history.
 */
export interface IGoalSubmittedEventReader {
  readStream(streamId: string): Promise<GoalEvent[]>;
}
