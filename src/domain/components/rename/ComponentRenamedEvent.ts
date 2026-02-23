/**
 * ComponentRenamed Event
 *
 * Emitted when an existing component is renamed.
 */

import { BaseEvent } from "../../BaseEvent.js";
import { ComponentEventType } from "../Constants.js";

export interface ComponentRenamedEvent extends BaseEvent {
  readonly type: typeof ComponentEventType.RENAMED;
  readonly payload: {
    readonly name: string;
  };
}
