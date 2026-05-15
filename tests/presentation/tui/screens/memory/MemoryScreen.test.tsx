import React from "react";
import { describe, expect, it } from "@jest/globals";
import { render } from "ink-testing-library";
import { MemoryScreen } from "../../../../../src/presentation/tui/screens/MemoryScreen.js";
import {
  PLACEHOLDER_COMPONENTS,
  PLACEHOLDER_DECISIONS,
  PLACEHOLDER_DEPENDENCIES,
  PLACEHOLDER_GUIDELINES,
  PLACEHOLDER_INVARIANTS,
} from "../../../../../src/presentation/tui/screens/memory/MemoryPlaceholderData.js";

const RIGHT_ARROW = "\x1B[C";

describe("MemoryScreen", () => {
  it("renders entity detail for the initially selected decision", () => {
    const { lastFrame, unmount } = render(<MemoryScreen />);
    const frame = lastFrame() ?? "";

    expect(frame).toContain(PLACEHOLDER_DECISIONS[0].id);
    unmount();
  });

  it("renders the detail of the first row of every entity-type column as selection moves through them", async () => {
    const { lastFrame, stdin, unmount } = render(<MemoryScreen />);

    const expectedIdsByColumnOrder = [
      PLACEHOLDER_INVARIANTS[0].id,
      PLACEHOLDER_COMPONENTS[0].id,
      PLACEHOLDER_DEPENDENCIES[0].id,
      PLACEHOLDER_GUIDELINES[0].id,
    ];

    for (const expectedId of expectedIdsByColumnOrder) {
      stdin.write(RIGHT_ARROW);
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(lastFrame() ?? "").toContain(expectedId);
    }
    unmount();
  });

  it("opens the decision-add flow when 'a' is pressed on the decisions column", async () => {
    const { lastFrame, stdin, unmount } = render(<MemoryScreen />);

    stdin.write("a");
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(lastFrame()).toContain("Add Decision");
    unmount();
  });

  it("opens the component-add flow when 'a' is pressed on the components column", async () => {
    const { lastFrame, stdin, unmount } = render(<MemoryScreen />);

    stdin.write(RIGHT_ARROW);
    await new Promise((resolve) => setTimeout(resolve, 50));
    stdin.write(RIGHT_ARROW);
    await new Promise((resolve) => setTimeout(resolve, 50));
    stdin.write("a");
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(lastFrame()).toContain("Add Component");
    unmount();
  });
});
