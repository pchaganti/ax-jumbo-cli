import Database from "better-sqlite3";
import { SqliteDependencyViewReader } from "../../../../../src/infrastructure/context/dependencies/get/SqliteDependencyViewReader";

describe("SqliteDependencyViewReader", () => {
  let db: Database.Database;
  let reader: SqliteDependencyViewReader;

  beforeEach(() => {
    db = new Database(":memory:");
    db.exec(`
      CREATE TABLE dependency_views (
        dependencyId TEXT PRIMARY KEY,
        consumerId TEXT NOT NULL,
        providerId TEXT NOT NULL,
        endpoint TEXT,
        contract TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        removedAt TEXT,
        removalReason TEXT,
        version INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);
    reader = new SqliteDependencyViewReader(db);
  });

  afterEach(() => {
    db.close();
  });

  function insertDependency(id: string, createdAt: string): void {
    db.prepare(`
      INSERT INTO dependency_views (dependencyId, consumerId, providerId, status, version, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, "consumer_1", "provider_1", "active", 1, createdAt, createdAt);
  }

  describe("findByIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await reader.findByIds([]);
      expect(result).toEqual([]);
    });

    it("should return a single dependency by ID", async () => {
      insertDependency("dep_1", "2025-01-01T00:00:00Z");

      const result = await reader.findByIds(["dep_1"]);

      expect(result).toHaveLength(1);
      expect(result[0].dependencyId).toBe("dep_1");
    });

    it("should return multiple dependencies by IDs ordered by createdAt DESC", async () => {
      insertDependency("dep_1", "2025-01-01T00:00:00Z");
      insertDependency("dep_2", "2025-01-02T00:00:00Z");
      insertDependency("dep_3", "2025-01-03T00:00:00Z");

      const result = await reader.findByIds(["dep_1", "dep_2", "dep_3"]);

      expect(result).toHaveLength(3);
      expect(result[0].dependencyId).toBe("dep_3");
      expect(result[1].dependencyId).toBe("dep_2");
      expect(result[2].dependencyId).toBe("dep_1");
    });

    it("should return empty array for non-existent IDs", async () => {
      insertDependency("dep_1", "2025-01-01T00:00:00Z");

      const result = await reader.findByIds(["nonexistent_1", "nonexistent_2"]);

      expect(result).toEqual([]);
    });
  });
});
