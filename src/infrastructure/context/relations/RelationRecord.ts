/**
 * RelationRecord - Infrastructure-layer type representing a raw SQLite row
 * from the relation_views table.
 *
 * All fields map directly to SQLite column types.
 * Use RelationRecordMapper to convert to the application-layer RelationView.
 */

export interface RelationRecord {
  readonly id: string;
  readonly fromEntityType: string;
  readonly fromEntityId: string;
  readonly toEntityType: string;
  readonly toEntityId: string;
  readonly relationType: string;
  readonly strength: string | null;
  readonly description: string;
  readonly status: string;
  readonly version: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}
