import { DecisionRestoredEvent } from "../../../../domain/decisions/restore/DecisionRestoredEvent.js";
import { DecisionEvent } from "../../../../domain/decisions/EventIndex.js";
import { AppendResult } from "../../../persistence/IEventStore.js";

export interface IDecisionRestoredEventWriter {
  append(event: DecisionRestoredEvent): Promise<AppendResult>;
  readStream(aggregateId: string): Promise<DecisionEvent[]>;
}
