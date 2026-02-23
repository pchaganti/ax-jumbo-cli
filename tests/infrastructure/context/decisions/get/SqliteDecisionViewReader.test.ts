import Database from "better-sqlite3";
import { SqliteDecisionViewReader } from "../../../../../src/infrastructure/context/decisions/get/SqliteDecisionViewReader";

describe("SqliteDecisionViewReader", () => {
  let db: Database.Database;
  let reader: SqliteDecisionViewReader;

  beforeEach(() => {
    db = new Database(":memory:");
    db.exec(`
      CREATE TABLE decision_views (
        decisionId TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        context TEXT NOT NULL,
        rationale TEXT,
        alternatives TEXT,
        consequences TEXT,
        status TEXT NOT NULL,
        supersededBy TEXT,
        reversalReason TEXT,
        reversedAt TEXT,
        version INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);
    reader = new SqliteDecisionViewReader(db);
  });

  afterEach(() => {
    db.close();
  });

  function insertDecision(id: string, title: string, createdAt: string): void {
    db.prepare(`
      INSERT INTO decision_views (decisionId, title, context, rationale, alternatives, consequences, status, version, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, "context", "rationale", "[]", null, "active", 1, createdAt, createdAt);
  }

  describe("findByIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await reader.findByIds([]);
      expect(result).toEqual([]);
    });

    it("should return a single decision by ID", async () => {
      insertDecision("dec_1", "Use REST", "2025-01-01T00:00:00Z");

      const result = await reader.findByIds(["dec_1"]);

      expect(result).toHaveLength(1);
      expect(result[0].decisionId).toBe("dec_1");
      expect(result[0].title).toBe("Use REST");
    });

    it("should return multiple decisions by IDs ordered by createdAt DESC", async () => {
      insertDecision("dec_1", "First", "2025-01-01T00:00:00Z");
      insertDecision("dec_2", "Second", "2025-01-02T00:00:00Z");
      insertDecision("dec_3", "Third", "2025-01-03T00:00:00Z");

      const result = await reader.findByIds(["dec_1", "dec_2", "dec_3"]);

      expect(result).toHaveLength(3);
      expect(result[0].decisionId).toBe("dec_3");
      expect(result[1].decisionId).toBe("dec_2");
      expect(result[2].decisionId).toBe("dec_1");
    });

    it("should return empty array for non-existent IDs", async () => {
      insertDecision("dec_1", "Existing", "2025-01-01T00:00:00Z");

      const result = await reader.findByIds(["nonexistent_1", "nonexistent_2"]);

      expect(result).toEqual([]);
    });
  });
});
