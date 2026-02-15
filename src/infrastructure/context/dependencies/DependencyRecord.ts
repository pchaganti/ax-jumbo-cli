/**
 * DependencyRecord - Infrastructure-layer type representing a raw SQLite row
 * from the dependency_views table.
 *
 * All fields map directly to SQLite column types.
 * Use DependencyRecordMapper to convert to the application-layer DependencyView.
 */

export interface DependencyRecord {
  readonly id: string;
  readonly consumerId: string;
  readonly providerId: string;
  readonly endpoint: string | null;
  readonly contract: string | null;
  readonly status: string;
  readonly version: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly removedAt: string | null;
  readonly removalReason: string | null;
}
