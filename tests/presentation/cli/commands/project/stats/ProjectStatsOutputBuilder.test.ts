import { beforeEach, describe, expect, it } from "@jest/globals";
import { ProjectStatsOutputBuilder } from "../../../../../../src/presentation/cli/commands/project/stats/ProjectStatsOutputBuilder.js";
import type { ProjectStatsSnapshotView } from "../../../../../../src/application/context/project/stats/ProjectStatsSnapshotView.js";

const snapshot: ProjectStatsSnapshotView = {
  memoryCounts: {
    goals: 4,
    components: 2,
    dependencies: 1,
    decisions: 3,
    relations: 5,
    sessions: 2,
    guidelines: 1,
    invariants: 2,
    blockers: 1,
  },
  goalFlow: {
    byStatus: [
      { status: "blocked", count: 1 },
      { status: "refined", count: 2 },
    ],
    activeBlockers: 1,
    refinedGoalsReady: 2,
  },
  contextCoverage: {
    totalRelations: 5,
    relationTypesRepresented: 3,
    goalsWithContextRelations: 3,
    goalsWithoutContextRelations: 1,
    goalContextCoverageRatio: 0.75,
  },
};

describe("ProjectStatsOutputBuilder", () => {
  let builder: ProjectStatsOutputBuilder;

  beforeEach(() => {
    builder = new ProjectStatsOutputBuilder();
  });

  it("builds structured stats without deprecated Architecture surface", () => {
    const output = builder.buildStructured(snapshot);
    const data = output.getSections()[0].content as Record<string, any>;

    expect(data.projectStats.memoryCounts.goals).toBe(4);
    expect(data.projectStats.goalFlow.refinedGoalsReady).toBe(2);
    expect(data.projectStats.contextCoverage.goalContextCoverageRatio).toBe(
      0.75,
    );
    expect(JSON.stringify(data)).not.toMatch(/architecture/i);
  });

  it("builds human-readable aggregate stats", () => {
    const text = builder.build(snapshot).toHumanReadable();

    expect(text).toContain("Project Stats");
    expect(text).toContain("Goals: 4");
    expect(text).toContain("Goal context coverage: 75%");
    expect(text).not.toMatch(/architecture/i);
  });
});
