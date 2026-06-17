import { GoalEvent } from "../../../../domain/goals/EventIndex.js";

/**
 * Port interface for reading goal events to rehydrate aggregate.
 * Used by CloseGoalCommandHandler to load event history.
 */
export interface IGoalClosedEventReader {
  readStream(streamId: string): Promise<GoalEvent[]>;
}
