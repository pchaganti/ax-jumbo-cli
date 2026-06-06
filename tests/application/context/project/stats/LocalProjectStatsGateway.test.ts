import { describe, expect, it, jest } from "@jest/globals";
import { LocalProjectStatsGateway } from "../../../../../src/application/context/project/stats/LocalProjectStatsGateway.js";
import type { GetProjectStatsQueryHandler } from "../../../../../src/application/context/project/stats/GetProjectStatsQueryHandler.js";

describe("LocalProjectStatsGateway", () => {
  it("wraps the query snapshot in a response", async () => {
    const snapshot = {
      memoryCounts: {
        goals: 1,
        components: 0,
        dependencies: 0,
        decisions: 0,
        relations: 0,
        sessions: 0,
        guidelines: 0,
        invariants: 0,
        blockers: 0,
      },
      goalFlow: {
        byStatus: [{ status: "defined", count: 1 }],
        activeBlockers: 0,
        refinedGoalsReady: 0,
      },
      contextCoverage: {
        totalRelations: 0,
        relationTypesRepresented: 0,
        goalsWithContextRelations: 0,
        goalsWithoutContextRelations: 1,
        goalContextCoverageRatio: 0,
      },
    };
    const queryHandler = {
      execute: jest.fn().mockResolvedValue(snapshot),
    } as unknown as jest.Mocked<Pick<GetProjectStatsQueryHandler, "execute">>;
    const gateway = new LocalProjectStatsGateway(
      queryHandler as GetProjectStatsQueryHandler,
    );

    await expect(gateway.getProjectStats({ currentOnly: true })).resolves.toEqual(
      { snapshot },
    );
  });
});
