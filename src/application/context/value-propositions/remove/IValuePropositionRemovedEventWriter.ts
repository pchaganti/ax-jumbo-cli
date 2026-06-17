/**
 * Port interface for writing ValuePropositionRemovedEvent events.
 * Infrastructure layer will implement this with FsEventStore.
 */

import { ValuePropositionRemovedEvent } from "../../../../domain/value-propositions/remove/ValuePropositionRemovedEvent.js";
import { ValuePropositionEvent } from "../../../../domain/value-propositions/EventIndex.js";
import { AppendResult } from "../../../persistence/IEventStore.js";

export interface IValuePropositionRemovedEventWriter {
  /**
   * Appends a ValuePropositionRemovedEvent event to the event store.
   */
  append(event: ValuePropositionRemovedEvent): Promise<AppendResult>;

  /**
   * Reads all events for a value proposition aggregate.
   */
  readStream(aggregateId: string): Promise<ValuePropositionEvent[]>;
}
