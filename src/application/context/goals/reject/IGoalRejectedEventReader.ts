import { GoalEvent } from "../../../../domain/goals/EventIndex.js";

/**
 * Port interface for reading goal events to rehydrate aggregate.
 * Used by RejectGoalCommandHandler to load event history.
 */
export interface IGoalRejectedEventReader {
  readStream(streamId: string): Promise<GoalEvent[]>;
}
