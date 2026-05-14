import React from "react";
import { describe, expect, it } from "@jest/globals";
import { render } from "ink-testing-library";
import { CockpitLaunchpadView } from "../../../../src/presentation/tui/screens/CockpitLaunchpadView.js";

describe("CockpitLaunchpadView project panel", () => {
  it("renders the current working directory", () => {
    const { lastFrame } = render(<CockpitLaunchpadView />);
    const frame = lastFrame()!;

    expect(frame).toContain("Directory:");
    expect(frame).toContain(process.cwd());
  });
});