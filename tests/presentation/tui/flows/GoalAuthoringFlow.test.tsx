import React from "react";
import { describe, expect, it } from "@jest/globals";
import { render } from "ink-testing-library";
import { GoalAuthoringFlow } from "../../../../src/presentation/tui/flows/GoalAuthoringFlow.js";

describe("GoalAuthoringFlow", () => {
  it("renders the objective step using the wizard primitive", () => {
    const { lastFrame, unmount } = render(
      <GoalAuthoringFlow onComplete={() => {}} onCancel={() => {}} />,
    );

    const frame = lastFrame() ?? "";
    expect(frame).toContain("Author Goal");
    expect(frame).toContain("Objective");
    expect(frame).toContain("1/4");
    expect(frame).toContain("esc");
    unmount();
  });

  it("includes all goal authoring steps", async () => {
    const { lastFrame, stdin, unmount } = render(
      <GoalAuthoringFlow onComplete={() => {}} onCancel={() => {}} />,
    );

    stdin.write("Prototype S2");
    await new Promise((resolve) => setTimeout(resolve, 50));
    stdin.write("\r");
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(lastFrame()).toContain("Success criteria");

    stdin.write("Renders goals");
    await new Promise((resolve) => setTimeout(resolve, 50));
    stdin.write("\r");
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(lastFrame()).toContain("Scope in");

    stdin.write("src/presentation/tui");
    await new Promise((resolve) => setTimeout(resolve, 50));
    stdin.write("\t");
    await new Promise((resolve) => setTimeout(resolve, 50));
    stdin.write("src/application");
    await new Promise((resolve) => setTimeout(resolve, 50));
    stdin.write("\r");
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(lastFrame()).toContain("Related entities");
    unmount();
  });
});
