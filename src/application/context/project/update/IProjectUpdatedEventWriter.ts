/**
 * Port interface for writing ProjectUpdated events.
 * Infrastructure layer will implement this with FsEventStore.
 */

import { ProjectUpdatedEvent } from "../../../../domain/project/update/ProjectUpdatedEvent.js";
import { ProjectEvent } from "../../../../domain/project/EventIndex.js";
import { AppendResult } from "../../../persistence/IEventStore.js";

export interface IProjectUpdatedEventWriter {
  /**
   * Appends a ProjectUpdated event to the event store.
   */
  append(event: ProjectUpdatedEvent): Promise<AppendResult>;

  /**
   * Reads all events for a project aggregate.
   */
  readStream(aggregateId: string): Promise<ProjectEvent[]>;
}
