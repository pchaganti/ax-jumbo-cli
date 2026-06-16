import { GoalEvent } from "../../../../domain/goals/EventIndex.js";

/**
 * Port interface for reading goal events to rehydrate aggregate.
 * Used by SubmitGoalForReviewCommandHandler to load event history.
 */
export interface IGoalSubmittedForReviewEventReader {
  readStream(streamId: string): Promise<GoalEvent[]>;
}
