/**
 * FsComponentRenamedEventStore - File system event store for ComponentRenamed event.
 *
 * Implements IComponentRenamedEventWriter for persisting component rename events.
 * Extends the base FsEventStore implementation.
 */

import { FsEventStore } from "../../../persistence/FsEventStore.js";
import { IComponentRenamedEventWriter } from "../../../../application/context/components/rename/IComponentRenamedEventWriter.js";

export class FsComponentRenamedEventStore
  extends FsEventStore
  implements IComponentRenamedEventWriter
{
  constructor(rootDir: string) {
    super(rootDir);
  }
}
