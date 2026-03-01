/**
 * Tests for SqliteWorkerIdentityRegistry
 */

import Database from "better-sqlite3";
import { SqliteWorkerIdentityRegistry } from "../../../../src/infrastructure/host/workers/SqliteWorkerIdentityRegistry";
import { HostSessionKeyResolver, HostSessionKeyResult } from "../../../../src/infrastructure/host/session/HostSessionKeyResolver";

// Mock HostSessionKeyResolver for controlled testing
class MockHostSessionKeyResolver extends HostSessionKeyResolver {
  private mockKey: string;

  constructor(mockKey: string) {
    super();
    this.mockKey = mockKey;
  }

  override resolve(): HostSessionKeyResult {
    return {
      key: this.mockKey,
      parts: [{ source: "MOCK", value: this.mockKey }],
    };
  }
}

function createWorkersTable(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS workers (
      workerId TEXT PRIMARY KEY,
      hostSessionKey TEXT NOT NULL UNIQUE,
      mode TEXT,
      createdAt TEXT NOT NULL,
      lastSeenAt TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_workers_host_session_key ON workers(hostSessionKey);
  `);
}

describe("SqliteWorkerIdentityRegistry", () => {
  let db: Database.Database;

  beforeEach(() => {
    db = new Database(":memory:");
    createWorkersTable(db);
  });

  afterEach(() => {
    db.close();
  });

  describe("workerId property", () => {
    it("returns a valid UUID workerId", () => {
      const resolver = new MockHostSessionKeyResolver("test-session-key-1");
      const registry = new SqliteWorkerIdentityRegistry(db, resolver);

      const workerId = registry.workerId;

      // UUID v4 format
      expect(workerId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it("returns same workerId on multiple accesses", () => {
      const resolver = new MockHostSessionKeyResolver("test-session-key-2");
      const registry = new SqliteWorkerIdentityRegistry(db, resolver);

      const workerId1 = registry.workerId;
      const workerId2 = registry.workerId;
      const workerId3 = registry.workerId;

      expect(workerId1).toBe(workerId2);
      expect(workerId2).toBe(workerId3);
    });

    it("returns same workerId for same hostSessionKey across instances", () => {
      const sessionKey = "persistent-session-key";
      const resolver1 = new MockHostSessionKeyResolver(sessionKey);
      const resolver2 = new MockHostSessionKeyResolver(sessionKey);

      const registry1 = new SqliteWorkerIdentityRegistry(db, resolver1);
      const workerId1 = registry1.workerId;

      const registry2 = new SqliteWorkerIdentityRegistry(db, resolver2);
      const workerId2 = registry2.workerId;

      expect(workerId1).toBe(workerId2);
    });

    it("returns different workerIds for different hostSessionKeys", () => {
      const resolver1 = new MockHostSessionKeyResolver("session-key-a");
      const resolver2 = new MockHostSessionKeyResolver("session-key-b");

      const registry1 = new SqliteWorkerIdentityRegistry(db, resolver1);
      const registry2 = new SqliteWorkerIdentityRegistry(db, resolver2);

      const workerId1 = registry1.workerId;
      const workerId2 = registry2.workerId;

      expect(workerId1).not.toBe(workerId2);
    });
  });

  describe("persistence", () => {
    it("persists worker entry to SQLite", () => {
      const sessionKey = "test-session-for-persistence";
      const resolver = new MockHostSessionKeyResolver(sessionKey);
      const registry = new SqliteWorkerIdentityRegistry(db, resolver);

      const workerId = registry.workerId;

      const row = db
        .prepare("SELECT workerId, hostSessionKey, createdAt, lastSeenAt FROM workers WHERE hostSessionKey = ?")
        .get(sessionKey) as { workerId: string; hostSessionKey: string; createdAt: string; lastSeenAt: string };

      expect(row).toBeDefined();
      expect(row.workerId).toBe(workerId);
      expect(row.hostSessionKey).toBe(sessionKey);
      expect(row.createdAt).toBeDefined();
      expect(row.lastSeenAt).toBeDefined();
    });

    it("updates lastSeenAt on subsequent accesses", async () => {
      const sessionKey = "test-session-for-lastseen";
      const resolver = new MockHostSessionKeyResolver(sessionKey);

      // First access
      const registry1 = new SqliteWorkerIdentityRegistry(db, resolver);
      registry1.workerId;

      const row1 = db
        .prepare("SELECT lastSeenAt FROM workers WHERE hostSessionKey = ?")
        .get(sessionKey) as { lastSeenAt: string };
      const lastSeenAt1 = row1.lastSeenAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Second access with new instance
      const registry2 = new SqliteWorkerIdentityRegistry(db, resolver);
      registry2.workerId;

      const row2 = db
        .prepare("SELECT lastSeenAt FROM workers WHERE hostSessionKey = ?")
        .get(sessionKey) as { lastSeenAt: string };
      const lastSeenAt2 = row2.lastSeenAt;

      expect(lastSeenAt2).not.toBe(lastSeenAt1);
    });

    it("preserves createdAt on subsequent accesses", async () => {
      const sessionKey = "test-session-for-createdat";
      const resolver = new MockHostSessionKeyResolver(sessionKey);

      // First access
      const registry1 = new SqliteWorkerIdentityRegistry(db, resolver);
      registry1.workerId;

      const row1 = db
        .prepare("SELECT createdAt FROM workers WHERE hostSessionKey = ?")
        .get(sessionKey) as { createdAt: string };
      const createdAt1 = row1.createdAt;

      // Wait and second access
      await new Promise((resolve) => setTimeout(resolve, 10));

      const registry2 = new SqliteWorkerIdentityRegistry(db, resolver);
      registry2.workerId;

      const row2 = db
        .prepare("SELECT createdAt FROM workers WHERE hostSessionKey = ?")
        .get(sessionKey) as { createdAt: string };
      const createdAt2 = row2.createdAt;

      expect(createdAt2).toBe(createdAt1);
    });

    it("handles multiple workers in same database", () => {
      const resolver1 = new MockHostSessionKeyResolver("worker-1-key");
      const resolver2 = new MockHostSessionKeyResolver("worker-2-key");
      const resolver3 = new MockHostSessionKeyResolver("worker-3-key");

      const registry1 = new SqliteWorkerIdentityRegistry(db, resolver1);
      const registry2 = new SqliteWorkerIdentityRegistry(db, resolver2);
      const registry3 = new SqliteWorkerIdentityRegistry(db, resolver3);

      const workerId1 = registry1.workerId;
      const workerId2 = registry2.workerId;
      const workerId3 = registry3.workerId;

      const count = db.prepare("SELECT COUNT(*) as cnt FROM workers").get() as { cnt: number };
      expect(count.cnt).toBe(3);

      const row1 = db.prepare("SELECT workerId FROM workers WHERE hostSessionKey = ?").get("worker-1-key") as { workerId: string };
      const row2 = db.prepare("SELECT workerId FROM workers WHERE hostSessionKey = ?").get("worker-2-key") as { workerId: string };
      const row3 = db.prepare("SELECT workerId FROM workers WHERE hostSessionKey = ?").get("worker-3-key") as { workerId: string };

      expect(row1.workerId).toBe(workerId1);
      expect(row2.workerId).toBe(workerId2);
      expect(row3.workerId).toBe(workerId3);
    });
  });

  describe("worker mode", () => {
    it("returns null mode for new worker", () => {
      const resolver = new MockHostSessionKeyResolver("test-session-mode");
      const registry = new SqliteWorkerIdentityRegistry(db, resolver);

      // Trigger worker creation
      registry.workerId;

      expect(registry.getMode()).toBeNull();
    });

    it("returns null mode when worker does not exist", () => {
      const resolver = new MockHostSessionKeyResolver("nonexistent-session");
      const registry = new SqliteWorkerIdentityRegistry(db, resolver);

      expect(registry.getMode()).toBeNull();
    });

    it("sets and gets worker mode", () => {
      const resolver = new MockHostSessionKeyResolver("test-session-setmode");
      const registry = new SqliteWorkerIdentityRegistry(db, resolver);

      registry.setMode("implement");

      expect(registry.getMode()).toBe("implement");
    });

    it("updates mode between values", () => {
      const resolver = new MockHostSessionKeyResolver("test-session-update-mode");
      const registry = new SqliteWorkerIdentityRegistry(db, resolver);

      registry.setMode("plan");
      expect(registry.getMode()).toBe("plan");

      registry.setMode("implement");
      expect(registry.getMode()).toBe("implement");

      registry.setMode("review");
      expect(registry.getMode()).toBe("review");

      registry.setMode("codify");
      expect(registry.getMode()).toBe("codify");
    });

    it("clears mode when set to null", () => {
      const resolver = new MockHostSessionKeyResolver("test-session-clear-mode");
      const registry = new SqliteWorkerIdentityRegistry(db, resolver);

      registry.setMode("implement");
      expect(registry.getMode()).toBe("implement");

      registry.setMode(null);
      expect(registry.getMode()).toBeNull();
    });

    it("persists mode in SQLite", () => {
      const sessionKey = "test-session-persist-mode";
      const resolver = new MockHostSessionKeyResolver(sessionKey);
      const registry = new SqliteWorkerIdentityRegistry(db, resolver);

      registry.setMode("review");

      const row = db
        .prepare("SELECT mode FROM workers WHERE hostSessionKey = ?")
        .get(sessionKey) as { mode: string | null };

      expect(row.mode).toBe("review");
    });

    it("mode is independent per worker", () => {
      const resolver1 = new MockHostSessionKeyResolver("worker-mode-1");
      const resolver2 = new MockHostSessionKeyResolver("worker-mode-2");

      const registry1 = new SqliteWorkerIdentityRegistry(db, resolver1);
      const registry2 = new SqliteWorkerIdentityRegistry(db, resolver2);

      registry1.setMode("plan");
      registry2.setMode("implement");

      expect(registry1.getMode()).toBe("plan");
      expect(registry2.getMode()).toBe("implement");
    });
  });
});
