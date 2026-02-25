/**
 * FsGoalCommittedEventStore - File system event store for GoalCommittedEvent.
 *
 * Implements IGoalCommitEventWriter and IGoalCommitEventReader for
 * persisting and reading goal committed events.
 * Extends the base FsEventStore implementation.
 */

import { FsEventStore } from "../../../persistence/FsEventStore.js";
import { IGoalCommitEventWriter } from "../../../../application/context/goals/commit/IGoalCommitEventWriter.js";
import { IGoalCommitEventReader } from "../../../../application/context/goals/commit/IGoalCommitEventReader.js";

export class FsGoalCommittedEventStore
  extends FsEventStore
  implements IGoalCommitEventWriter, IGoalCommitEventReader
{
  constructor(rootDir: string) {
    super(rootDir);
  }
}
