import React from "react";
import { describe, expect, it } from "@jest/globals";
import { render } from "ink-testing-library";
import { CockpitProjectStatsPanel } from "../../../../src/presentation/tui/cockpit/CockpitProjectStatsPanel.js";
import { TuiStateReaderProvider } from "../../../../src/presentation/tui/state-reading/TuiStateReader.js";

async function waitForFrame(
  readFrame: () => string | undefined,
  expectedText: string,
): Promise<string> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const frame = readFrame() ?? "";

    if (frame.includes(expectedText)) {
      return frame;
    }

    await new Promise((resolve) => setTimeout(resolve, 25));
  }

  return readFrame() ?? "";
}

describe("CockpitProjectStatsPanel", () => {
  it("renders aggregate project stats without named diagnostics", async () => {
    const projectStatsController = {
      handle: async () => ({
        snapshot: {
          memoryCounts: {
            goals: 3,
            components: 2,
            dependencies: 1,
            decisions: 4,
            relations: 6,
            sessions: 2,
            guidelines: 1,
            invariants: 1,
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
            totalRelations: 6,
            relationTypesRepresented: 3,
            goalsWithContextRelations: 2,
            goalsWithoutContextRelations: 1,
            goalContextCoverageRatio: 2 / 3,
          },
        },
      }),
    };

    const { lastFrame, unmount } = render(
      <TuiStateReaderProvider
        controllers={{ projectStatsController }}
        options={{ tickMs: 0 }}
      >
        <CockpitProjectStatsPanel />
      </TuiStateReaderProvider>,
    );

    const frame = await waitForFrame(lastFrame, "goals 3");

    expect(frame).toContain("goals 3");
    expect(frame).toContain("relations 6");
    expect(frame).toContain("context coverage 67%");
    expect(frame).not.toContain("goal_orphan");
    expect(frame).not.toContain("component_without_goal");
    expect(frame).not.toMatch(/architecture/i);
    unmount();
  });
});
