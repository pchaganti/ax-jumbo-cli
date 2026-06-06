import Database from "better-sqlite3";
import { SqliteProjectStatsQuery } from "../../../../../src/infrastructure/context/project/stats/SqliteProjectStatsQuery.js";

describe("SqliteProjectStatsQuery", () => {
  let db: Database.Database;
  let query: SqliteProjectStatsQuery;

  beforeEach(() => {
    db = new Database(":memory:");
    db.exec(`
      CREATE TABLE goal_views (goalId TEXT PRIMARY KEY, status TEXT NOT NULL);
      CREATE TABLE component_views (componentId TEXT PRIMARY KEY, status TEXT NOT NULL);
      CREATE TABLE dependency_views (dependencyId TEXT PRIMARY KEY, status TEXT NOT NULL);
      CREATE TABLE decision_views (decisionId TEXT PRIMARY KEY, status TEXT NOT NULL);
      CREATE TABLE relation_views (
        relationId TEXT PRIMARY KEY,
        fromEntityType TEXT NOT NULL,
        fromEntityId TEXT NOT NULL,
        toEntityType TEXT NOT NULL,
        toEntityId TEXT NOT NULL,
        relationType TEXT NOT NULL,
        status TEXT NOT NULL
      );
      CREATE TABLE session_views (sessionId TEXT PRIMARY KEY, status TEXT NOT NULL);
      CREATE TABLE guideline_views (guidelineId TEXT PRIMARY KEY, isRemoved INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE invariant_views (invariantId TEXT PRIMARY KEY);
    `);
    query = new SqliteProjectStatsQuery(db);
  });

  afterEach(() => {
    db.close();
  });

  it("maps current materialized views into aggregate project stats", async () => {
    db.prepare("INSERT INTO goal_views (goalId, status) VALUES (?, ?)").run(
      "goal_1",
      "refined",
    );
    db.prepare("INSERT INTO goal_views (goalId, status) VALUES (?, ?)").run(
      "goal_2",
      "blocked",
    );
    db.prepare("INSERT INTO goal_views (goalId, status) VALUES (?, ?)").run(
      "goal_3",
      "done",
    );
    db.prepare("INSERT INTO component_views (componentId, status) VALUES (?, ?)").run(
      "component_1",
      "active",
    );
    db.prepare("INSERT INTO component_views (componentId, status) VALUES (?, ?)").run(
      "component_2",
      "deprecated",
    );
    db.prepare("INSERT INTO dependency_views (dependencyId, status) VALUES (?, ?)").run(
      "dependency_1",
      "active",
    );
    db.prepare("INSERT INTO decision_views (decisionId, status) VALUES (?, ?)").run(
      "decision_1",
      "active",
    );
    db.prepare("INSERT INTO decision_views (decisionId, status) VALUES (?, ?)").run(
      "decision_2",
      "reversed",
    );
    db.prepare("INSERT INTO session_views (sessionId, status) VALUES (?, ?)").run(
      "session_1",
      "ended",
    );
    db.prepare("INSERT INTO guideline_views (guidelineId, isRemoved) VALUES (?, ?)").run(
      "guideline_1",
      0,
    );
    db.prepare("INSERT INTO guideline_views (guidelineId, isRemoved) VALUES (?, ?)").run(
      "guideline_2",
      1,
    );
    db.prepare("INSERT INTO invariant_views (invariantId) VALUES (?)").run(
      "invariant_1",
    );
    const insertRelation = db.prepare(`
      INSERT INTO relation_views (
        relationId, fromEntityType, fromEntityId, toEntityType, toEntityId, relationType, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    insertRelation.run(
      "relation_1",
      "goal",
      "goal_1",
      "component",
      "component_1",
      "involves",
      "active",
    );
    insertRelation.run(
      "relation_2",
      "dependency",
      "dependency_1",
      "goal",
      "goal_2",
      "depends-on",
      "active",
    );
    insertRelation.run(
      "relation_3",
      "goal",
      "goal_1",
      "goal",
      "goal_3",
      "related",
      "active",
    );
    insertRelation.run(
      "relation_4",
      "goal",
      "goal_3",
      "decision",
      "decision_1",
      "involves",
      "deactivated",
    );

    const snapshot = await query.currentSnapshot();

    expect(snapshot.memoryCounts).toEqual({
      goals: 3,
      components: 1,
      dependencies: 1,
      decisions: 1,
      relations: 3,
      sessions: 1,
      guidelines: 1,
      invariants: 1,
      blockers: 1,
    });
    expect(snapshot.goalFlow.byStatus).toEqual([
      { status: "blocked", count: 1 },
      { status: "done", count: 1 },
      { status: "refined", count: 1 },
    ]);
    expect(snapshot.goalFlow.refinedGoalsReady).toBe(1);
    expect(snapshot.contextCoverage).toEqual({
      totalRelations: 3,
      relationTypesRepresented: 3,
      goalsWithContextRelations: 2,
      goalsWithoutContextRelations: 1,
      goalContextCoverageRatio: 2 / 3,
    });
  });
});
