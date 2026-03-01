/**
 * SqliteWorkerIdentityRegistry - SQLite-based worker identity persistence
 *
 * Maps host session keys to worker IDs and persists the mapping in SQLite.
 * Ensures that the same terminal/IDE session always gets the same workerId.
 *
 * Key Design:
 * - Resolves workerId lazily on first property access and caches it
 * - Persists hostSessionKey -> workerId mapping in the workers table
 * - Implements IWorkerIdentityReader for application layer consumption
 * - Implements IWorkerModeAccessor for reading/writing worker mode
 * - Uses UUID v4 for generating new worker IDs
 */

import { Database } from "better-sqlite3";
import { randomUUID } from "crypto";
import { IWorkerIdentityReader } from "../../../application/host/workers/IWorkerIdentityReader.js";
import { IWorkerModeAccessor } from "../../../application/host/workers/IWorkerModeAccessor.js";
import { WorkerId } from "../../../application/host/workers/WorkerId.js";
import { WorkerMode } from "../../../application/host/workers/WorkerMode.js";
import { HostSessionKeyResolver } from "../session/HostSessionKeyResolver.js";
import { WorkerRecord } from "./WorkerRecord.js";
import { WorkerRecordMapper } from "./WorkerRecordMapper.js";

export class SqliteWorkerIdentityRegistry implements IWorkerIdentityReader, IWorkerModeAccessor {
  private readonly db: Database;
  private readonly sessionKeyResolver: HostSessionKeyResolver;
  private readonly mapper: WorkerRecordMapper;
  private resolvedWorkerId: WorkerId | null = null;

  constructor(db: Database, sessionKeyResolver: HostSessionKeyResolver) {
    this.db = db;
    this.sessionKeyResolver = sessionKeyResolver;
    this.mapper = new WorkerRecordMapper();
  }

  /**
   * Gets the unique identifier for the current worker.
   *
   * Lazily resolves the workerId on first access and caches it.
   * Subsequent calls return the cached value.
   */
  get workerId(): WorkerId {
    if (this.resolvedWorkerId === null) {
      this.resolvedWorkerId = this.resolveWorkerId();
    }
    return this.resolvedWorkerId;
  }

  /**
   * Gets the current mode of the worker.
   */
  getMode(): WorkerMode {
    const { key: hostSessionKey } = this.sessionKeyResolver.resolve();
    const row = this.db
      .prepare("SELECT workerId, hostSessionKey, mode, createdAt, lastSeenAt FROM workers WHERE hostSessionKey = ?")
      .get(hostSessionKey) as WorkerRecord | undefined;

    if (!row) {
      return null;
    }

    return this.mapper.toWorkerMode(row);
  }

  /**
   * Sets the operating mode of the current worker.
   */
  setMode(mode: WorkerMode): void {
    // Ensure worker exists by accessing workerId (triggers lazy resolution)
    const _ = this.workerId;
    const { key: hostSessionKey } = this.sessionKeyResolver.resolve();

    this.db
      .prepare("UPDATE workers SET mode = ? WHERE hostSessionKey = ?")
      .run(mode, hostSessionKey);
  }

  /**
   * Resolves the workerId for the current host session.
   *
   * Looks up the existing mapping or creates a new one if not found.
   * Updates the lastSeenAt timestamp on each access.
   */
  private resolveWorkerId(): WorkerId {
    const { key: hostSessionKey } = this.sessionKeyResolver.resolve();

    const existingRow = this.db
      .prepare("SELECT workerId, hostSessionKey, mode, createdAt, lastSeenAt FROM workers WHERE hostSessionKey = ?")
      .get(hostSessionKey) as WorkerRecord | undefined;

    if (existingRow) {
      // Update last seen timestamp
      this.db
        .prepare("UPDATE workers SET lastSeenAt = ? WHERE hostSessionKey = ?")
        .run(new Date().toISOString(), hostSessionKey);

      return this.mapper.toWorkerId(existingRow);
    }

    // Create new worker entry
    const newWorkerId = randomUUID();
    const now = new Date().toISOString();

    this.db
      .prepare("INSERT INTO workers (workerId, hostSessionKey, mode, createdAt, lastSeenAt) VALUES (?, ?, ?, ?, ?)")
      .run(newWorkerId, hostSessionKey, null, now, now);

    return this.mapper.toWorkerId({ workerId: newWorkerId, hostSessionKey, mode: null, createdAt: now, lastSeenAt: now });
  }
}
