import type { Database } from "better-sqlite3";
import type { IProjectStatsQuery } from "../../../../application/context/project/stats/IProjectStatsQuery.js";
import type { GoalStatusCountView } from "../../../../application/context/project/stats/GoalStatusCountView.js";
import type { ProjectStatsSnapshotView } from "../../../../application/context/project/stats/ProjectStatsSnapshotView.js";

interface CountRow {
  readonly count: number;
}

interface GoalStatusCountRow {
  readonly status: string;
  readonly count: number;
}

const CONTEXT_ENTITY_TYPES = [
  "component",
  "dependency",
  "decision",
  "guideline",
  "invariant",
] as const;

export class SqliteProjectStatsQuery implements IProjectStatsQuery {
  constructor(private readonly db: Database) {}

  async currentSnapshot(): Promise<ProjectStatsSnapshotView> {
    const goals = this.count("SELECT COUNT(*) AS count FROM goal_views");
    const components = this.count(
      "SELECT COUNT(*) AS count FROM component_views WHERE status = 'active'",
    );
    const dependencies = this.count(
      "SELECT COUNT(*) AS count FROM dependency_views WHERE status = 'active'",
    );
    const decisions = this.count(
      "SELECT COUNT(*) AS count FROM decision_views WHERE status = 'active'",
    );
    const relations = this.count(
      "SELECT COUNT(*) AS count FROM relation_views WHERE status = 'active'",
    );
    const sessions = this.count("SELECT COUNT(*) AS count FROM session_views");
    const guidelines = this.count(
      "SELECT COUNT(*) AS count FROM guideline_views WHERE isRemoved = 0",
    );
    const invariants = this.count(
      "SELECT COUNT(*) AS count FROM invariant_views",
    );
    const blockers = this.count(
      "SELECT COUNT(*) AS count FROM goal_views WHERE status = 'blocked'",
    );
    const byStatus = this.goalStatusCounts();
    const relationTypesRepresented = this.count(
      "SELECT COUNT(DISTINCT relationType) AS count FROM relation_views WHERE status = 'active'",
    );
    const goalsWithContextRelations = this.goalsWithContextRelations();
    const goalsWithoutContextRelations = Math.max(
      goals - goalsWithContextRelations,
      0,
    );

    return {
      memoryCounts: {
        goals,
        components,
        dependencies,
        decisions,
        relations,
        sessions,
        guidelines,
        invariants,
        blockers,
      },
      goalFlow: {
        byStatus,
        activeBlockers: blockers,
        refinedGoalsReady: this.count(
          "SELECT COUNT(*) AS count FROM goal_views WHERE status = 'refined'",
        ),
      },
      contextCoverage: {
        totalRelations: relations,
        relationTypesRepresented,
        goalsWithContextRelations,
        goalsWithoutContextRelations,
        goalContextCoverageRatio:
          goals === 0 ? 0 : goalsWithContextRelations / goals,
      },
    };
  }

  private count(sql: string): number {
    const row = this.db.prepare(sql).get() as CountRow | undefined;
    return row?.count ?? 0;
  }

  private goalStatusCounts(): readonly GoalStatusCountView[] {
    const rows = this.db
      .prepare(
        `SELECT status, COUNT(*) AS count
         FROM goal_views
         GROUP BY status
         ORDER BY status ASC`,
      )
      .all() as GoalStatusCountRow[];

    return rows.map((row) => ({
      status: row.status,
      count: row.count,
    }));
  }

  private goalsWithContextRelations(): number {
    const placeholders = CONTEXT_ENTITY_TYPES.map(() => "?").join(", ");
    const row = this.db
      .prepare(
        `SELECT COUNT(DISTINCT goalId) AS count
         FROM (
           SELECT fromEntityId AS goalId
           FROM relation_views
           WHERE status = 'active'
             AND fromEntityType = 'goal'
             AND toEntityType IN (${placeholders})
           UNION
           SELECT toEntityId AS goalId
           FROM relation_views
           WHERE status = 'active'
             AND toEntityType = 'goal'
             AND fromEntityType IN (${placeholders})
         )`,
      )
      .get(...CONTEXT_ENTITY_TYPES, ...CONTEXT_ENTITY_TYPES) as
      | CountRow
      | undefined;

    return row?.count ?? 0;
  }
}
