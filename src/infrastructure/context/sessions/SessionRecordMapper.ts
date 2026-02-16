/**
 * SessionRecordMapper - Maps infrastructure SessionRecord to application SessionView.
 *
 * Handles null-to-null preservation for optional fields at the
 * infrastructure-application boundary.
 */

import { SessionView } from "../../../application/context/sessions/SessionView.js";
import { SessionRecord } from "./SessionRecord.js";

export class SessionRecordMapper {
  toView(record: SessionRecord): SessionView {
    return {
      sessionId: record.id,
      focus: record.focus,
      status: record.status as SessionView["status"],
      contextSnapshot: record.contextSnapshot,
      version: record.version,
      startedAt: record.startedAt,
      endedAt: record.endedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
