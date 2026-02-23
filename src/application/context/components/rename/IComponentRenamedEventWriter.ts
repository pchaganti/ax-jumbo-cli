import { ComponentRenamedEvent } from "../../../../domain/components/rename/ComponentRenamedEvent.js";
import { BaseEvent } from "../../../../domain/BaseEvent.js";
import { AppendResult } from "../../../persistence/IEventStore.js";

export interface IComponentRenamedEventWriter {
  append(event: ComponentRenamedEvent): Promise<AppendResult>;
  readStream(aggregateId: string): Promise<BaseEvent[]>;
}
