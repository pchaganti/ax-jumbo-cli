/**
 * ComponentRecord - Infrastructure-layer type representing a raw SQLite row
 * from the component_views table.
 *
 * All fields map directly to SQLite column types.
 * Use ComponentRecordMapper to convert to the application-layer ComponentView.
 */

export interface ComponentRecord {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly description: string;
  readonly responsibility: string;
  readonly path: string;
  readonly status: string;
  readonly deprecationReason: string | null;
  readonly version: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}
