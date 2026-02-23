/**
 * SessionRecord - Infrastructure-layer type representing a raw SQLite row
 * from the session_views table.
 *
 * Optional fields are nullable. Use SessionRecordMapper to convert
 * to the application-layer SessionView.
 */

export interface SessionRecord {
  readonly id: string;
  readonly focus: string | null;
  readonly status: string;
  readonly contextSnapshot: string | null;
  readonly version: number;
  readonly startedAt: string;
  readonly endedAt: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}
