import React from "react";
import { describe, expect, it } from "@jest/globals";
import { render } from "ink-testing-library";
import { GoalsScreen } from "../../../../src/presentation/tui/screens/GoalsScreen.js";

describe("GoalsScreen", () => {
  it("renders the screen title", () => {
    const { lastFrame } = render(<GoalsScreen />);
    expect(lastFrame()).toContain("Goals");
  });

  it("renders placeholder description", () => {
    const { lastFrame } = render(<GoalsScreen />);
    expect(lastFrame()).toContain("Goal backlog");
  });
});
