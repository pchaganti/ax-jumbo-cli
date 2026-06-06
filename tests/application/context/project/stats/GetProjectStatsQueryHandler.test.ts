import { describe, expect, it, jest } from "@jest/globals";
import { GetProjectStatsQueryHandler } from "../../../../../src/application/context/project/stats/GetProjectStatsQueryHandler.js";
import type { IProjectStatsQuery } from "../../../../../src/application/context/project/stats/IProjectStatsQuery.js";
import type { ProjectStatsSnapshotView } from "../../../../../src/application/context/project/stats/ProjectStatsSnapshotView.js";

const snapshot: ProjectStatsSnapshotView = {
  memoryCounts: {
    goals: 2,
    components: 1,
    dependencies: 1,
    decisions: 1,
    relations: 2,
    sessions: 1,
    guidelines: 1,
    invariants: 1,
    blockers: 0,
  },
  goalFlow: {
    byStatus: [{ status: "refined", count: 2 }],
    activeBlockers: 0,
    refinedGoalsReady: 2,
  },
  contextCoverage: {
    totalRelations: 2,
    relationTypesRepresented: 1,
    goalsWithContextRelations: 1,
    goalsWithoutContextRelations: 1,
    goalContextCoverageRatio: 0.5,
  },
};

describe("GetProjectStatsQueryHandler", () => {
  it("returns the current project stats snapshot from the query abstraction", async () => {
    const query = {
      currentSnapshot: jest.fn().mockResolvedValue(snapshot),
    } as jest.Mocked<IProjectStatsQuery>;
    const handler = new GetProjectStatsQueryHandler(query);

    await expect(handler.execute({ currentOnly: true })).resolves.toEqual(
      snapshot,
    );
    expect(query.currentSnapshot).toHaveBeenCalledTimes(1);
  });
});
