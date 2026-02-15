/**
 * SqliteComponentReader - SQLite reader for single component lookup.
 *
 * Implements IComponentReader for retrieving a component by ID or name
 * from the SQLite read model.
 */

import { Database } from "better-sqlite3";
import { IComponentReader } from "../../../../application/context/components/get/IComponentReader.js";
import { ComponentView } from "../../../../application/context/components/ComponentView.js";
import { ComponentRecord } from "../ComponentRecord.js";
import { ComponentRecordMapper } from "../ComponentRecordMapper.js";

export class SqliteComponentReader implements IComponentReader {
  private readonly mapper = new ComponentRecordMapper();

  constructor(private db: Database) {}

  async findById(componentId: string): Promise<ComponentView | null> {
    const row = this.db
      .prepare("SELECT * FROM component_views WHERE componentId = ?")
      .get(componentId) as Record<string, unknown> | undefined;

    return row ? this.mapper.toView(this.mapRowToRecord(row)) : null;
  }

  async findByName(name: string): Promise<ComponentView | null> {
    const row = this.db
      .prepare("SELECT * FROM component_views WHERE name = ?")
      .get(name) as Record<string, unknown> | undefined;

    return row ? this.mapper.toView(this.mapRowToRecord(row)) : null;
  }

  private mapRowToRecord(row: Record<string, unknown>): ComponentRecord {
    return {
      id: row.componentId as string,
      name: row.name as string,
      type: row.type as string,
      description: row.description as string,
      responsibility: row.responsibility as string,
      path: row.path as string,
      status: row.status as string,
      deprecationReason: (row.deprecationReason as string) ?? null,
      version: row.version as number,
      createdAt: row.createdAt as string,
      updatedAt: row.updatedAt as string,
    };
  }
}
