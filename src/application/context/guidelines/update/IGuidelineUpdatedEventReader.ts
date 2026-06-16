import { GuidelineEvent } from "../../../../domain/guidelines/EventIndex.js";

/**
 * Port interface for reading guideline events to rehydrate aggregate.
 * Used by UpdateGuidelineCommandHandler to load event history.
 */
export interface IGuidelineUpdatedEventReader {
  readStream(streamId: string): Promise<GuidelineEvent[]>;
}
