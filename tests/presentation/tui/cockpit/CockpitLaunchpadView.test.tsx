import React from "react";
import { describe, expect, it, jest } from "@jest/globals";
import { Text } from "ink";
import { render } from "ink-testing-library";
import { CockpitLaunchpadView } from "../../../../src/presentation/tui/cockpit/CockpitLaunchpadView.js";
import { TuiStateReaderProvider } from "../../../../src/presentation/tui/state-reading/TuiStateReader.js";

const tick = () => new Promise((resolve) => setTimeout(resolve, 50));

describe("CockpitLaunchpadView", () => {
  it("renders the launch animation until the injected renderer reports completion", () => {
    const onDone = jest.fn();
    const onLaunchAnimationDone = jest.fn();
    const launchAnimationRenderer = jest.fn(({ onDone: complete }) => {
      onDone.mockImplementation(complete);
      return <Text>launching cockpit</Text>;
    });
    const { lastFrame, rerender, unmount } = render(
      <CockpitLaunchpadView
        launchAnimationSize={{ width: 80, height: 24 }}
        launchAnimationRenderer={launchAnimationRenderer}
        onLaunchAnimationDone={onLaunchAnimationDone}
      />,
    );

    expect(lastFrame()).toContain("launching cockpit");
    expect(launchAnimationRenderer).toHaveBeenCalledWith(
      expect.objectContaining({ width: 80, height: 24 }),
    );

    onDone();
    rerender(
      <CockpitLaunchpadView
        launchAnimationSize={{ width: 80, height: 24 }}
        launchAnimationRenderer={launchAnimationRenderer}
        onLaunchAnimationDone={onLaunchAnimationDone}
      />,
    );

    expect(onLaunchAnimationDone).toHaveBeenCalledTimes(1);
    expect(lastFrame()).not.toContain("launching cockpit");
    unmount();
  });

  it("renders project stats above daemon panels", async () => {
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
        <CockpitLaunchpadView
          reviewerFrameDurationMs={0}
          refinerFrameDurationMs={0}
          codifierFrameDurationMs={0}
        />
      </TuiStateReaderProvider>,
    );

    await tick();
    const frame = lastFrame() ?? "";

    expect(frame.indexOf("STATS//")).toBeGreaterThanOrEqual(0);
    expect(frame.indexOf("STATS//")).toBeLessThan(frame.indexOf("REFINER"));
    unmount();
  });
});
