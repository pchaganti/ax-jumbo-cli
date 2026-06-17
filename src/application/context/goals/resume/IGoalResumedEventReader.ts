import { GoalEvent } from "../../../../domain/goals/EventIndex.js";

/**
 * Port interface for reading goal events to rehydrate aggregate.
 * Used by ResumeGoalCommandHandler to load event history.
 */
export interface IGoalResumedEventReader {
  readStream(streamId: string): Promise<GoalEvent[]>;
}
