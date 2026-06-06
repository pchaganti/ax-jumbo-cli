import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import type { IApplicationContainer } from "../../../../../../src/application/host/IApplicationContainer.js";
import type { ProjectStatsController } from "../../../../../../src/application/context/project/stats/ProjectStatsController.js";
import { projectStatsCommand } from "../../../../../../src/presentation/cli/commands/project/stats/project.stats.js";
import { Renderer } from "../../../../../../src/presentation/cli/rendering/Renderer.js";

describe("project.stats command", () => {
  let consoleSpy: jest.SpiedFunction<typeof console.log>;
  let mockController: jest.Mocked<Pick<ProjectStatsController, "handle">>;
  let container: Partial<IApplicationContainer>;

  beforeEach(() => {
    Renderer.configure({ format: "json", verbosity: "normal" });
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    mockController = {
      handle: jest.fn().mockResolvedValue({
        snapshot: {
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
            byStatus: [{ status: "refined", count: 1 }],
            activeBlockers: 0,
            refinedGoalsReady: 1,
          },
          contextCoverage: {
            totalRelations: 0,
            relationTypesRepresented: 0,
            goalsWithContextRelations: 0,
            goalsWithoutContextRelations: 1,
            goalContextCoverageRatio: 0,
          },
        },
      }),
    } as jest.Mocked<Pick<ProjectStatsController, "handle">>;
    container = {
      projectStatsController:
        mockController as unknown as ProjectStatsController,
    };
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    Renderer.reset();
  });

  it("requests the current stats snapshot", async () => {
    await projectStatsCommand.handler({}, container as IApplicationContainer);

    expect(mockController.handle).toHaveBeenCalledWith({ currentOnly: true });
  });

  it("emits one complete JSON object without extra stdout calls", async () => {
    await projectStatsCommand.handler({}, container as IApplicationContainer);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const parsed = JSON.parse(consoleSpy.mock.calls[0][0] as string);
    expect(parsed.projectStats.memoryCounts.goals).toBe(1);
  });
});
