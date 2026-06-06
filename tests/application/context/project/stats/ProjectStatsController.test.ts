import { describe, expect, it, jest } from "@jest/globals";
import { ProjectStatsController } from "../../../../../src/application/context/project/stats/ProjectStatsController.js";
import type { IProjectStatsGateway } from "../../../../../src/application/context/project/stats/IProjectStatsGateway.js";

describe("ProjectStatsController", () => {
  it("delegates stats requests to the gateway", async () => {
    const response = {
      snapshot: {
        memoryCounts: {
          goals: 0,
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
          byStatus: [],
          activeBlockers: 0,
          refinedGoalsReady: 0,
        },
        contextCoverage: {
          totalRelations: 0,
          relationTypesRepresented: 0,
          goalsWithContextRelations: 0,
          goalsWithoutContextRelations: 0,
          goalContextCoverageRatio: 0,
        },
      },
    };
    const gateway = {
      getProjectStats: jest.fn().mockResolvedValue(response),
    } as jest.Mocked<IProjectStatsGateway>;
    const controller = new ProjectStatsController(gateway);

    await expect(controller.handle({ currentOnly: true })).resolves.toBe(
      response,
    );
    expect(gateway.getProjectStats).toHaveBeenCalledWith({
      currentOnly: true,
    });
  });
});
