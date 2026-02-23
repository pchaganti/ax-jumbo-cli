/**
 * DecisionRecord - Infrastructure-layer type representing a raw SQLite row
 * from the decision_views table.
 *
 * Array fields are stored as JSON strings. Optional fields are nullable.
 * Use DecisionRecordMapper to convert to the application-layer DecisionView.
 */

export interface DecisionRecord {
  readonly id: string;
  readonly title: string;
  readonly context: string;
  readonly rationale: string | null;
  readonly alternatives: string; // JSON array
  readonly consequences: string | null;
  readonly status: string;
  readonly supersededBy: string | null;
  readonly reversalReason: string | null;
  readonly reversedAt: string | null;
  readonly version: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}
