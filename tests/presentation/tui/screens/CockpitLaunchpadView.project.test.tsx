import React from "react";
import path from "node:path";
import { describe, expect, it } from "@jest/globals";
import { render } from "ink-testing-library";
import { CockpitLaunchpadView } from "../../../../src/presentation/tui/screens/CockpitLaunchpadView.js";
import { TuiStateReaderProvider } from "../../../../src/presentation/tui/state/TuiStateReader.js";

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

describe("CockpitLaunchpadView project panel", () => {
  it("renders the current working directory", () => {
    const { lastFrame, unmount } = render(<CockpitLaunchpadView />);
    expect(lastFrame()!).toContain(path.basename(process.cwd()));
    unmount();
  });

  it("renders project summary from the state reader", async () => {
    const { lastFrame, unmount } = render(
      <TuiStateReaderProvider
        controllers={{
          getProjectSummaryQueryHandler: {
            execute: async () => ({
              name: "Project Atlas",
              purpose: "Map context into the TUI",
              lifecycleState: "primed",
            }),
          },
        }}
        options={{ tickMs: 0 }}
      >
        <CockpitLaunchpadView />
      </TuiStateReaderProvider>,
    );

    const frame = await waitForFrame(lastFrame, "Project Atlas");

    expect(frame).toContain("Project Atlas");
    expect(frame).toContain("Map context into the TUI");
    unmount();
  });
});
