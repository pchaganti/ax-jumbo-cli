import { BaseEvent } from "../../../../domain/BaseEvent.js";

/**
 * Port interface for reading goal events to rehydrate aggregate.
 * Used by RejectGoalCommandHandler to load event history.
 */
export interface IGoalRejectedEventReader {
  readStream(streamId: string): Promise<BaseEvent[]>;
}
