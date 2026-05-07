import React from "react";
import { describe, expect, it } from "@jest/globals";
import { render } from "ink-testing-library";
import { CockpitScreen } from "../../../../src/presentation/tui/screens/CockpitScreen.js";

describe("CockpitScreen", () => {
  it("renders the screen title", () => {
    const { lastFrame } = render(<CockpitScreen />);
    expect(lastFrame()).toContain("Cockpit");
  });

  it("renders placeholder description", () => {
    const { lastFrame } = render(<CockpitScreen />);
    expect(lastFrame()).toContain("Project orientation");
  });
});
