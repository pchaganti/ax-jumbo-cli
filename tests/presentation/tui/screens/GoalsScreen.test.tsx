import React from "react";
import { describe, expect, it } from "@jest/globals";
import { render } from "ink-testing-library";
import { GoalsScreen } from "../../../../src/presentation/tui/screens/GoalsScreen.js";

describe("GoalsScreen", () => {
  it("renders a placeholder goal list with status indicators", () => {
    const { lastFrame, unmount } = render(<GoalsScreen />);

    const frame = lastFrame() ?? "";
    expect(frame).toContain("Goal List");
    expect(frame).toContain("Prototype Goals");
    expect(frame).toContain("screen");
    expect(frame).toContain("doing");
    expect(frame).toContain("●");
    unmount();
  });

  it("renders selected goal details and lifecycle action hints", () => {
    const { lastFrame, unmount } = render(<GoalsScreen />);

    const frame = lastFrame() ?? "";
    expect(frame).toContain("Goal Detail");
    expect(frame).toContain("Title");
    expect(frame).toContain("Objective");
    expect(frame).toContain("Criteria");
    expect(frame).toContain("Scope in");
    expect(frame).toContain("Related");
    expect(frame).toContain("Actions");
    expect(frame).toContain("Action Hints");
    expect(frame).toContain("submit");
    unmount();
  });

  it("opens the goal authoring wizard from the goals screen", async () => {
    const { lastFrame, stdin, unmount } = render(<GoalsScreen />);

    stdin.write("a");
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(lastFrame()).toContain("Author Goal");
    expect(lastFrame()).toContain("Objective");
    unmount();
  });
});
