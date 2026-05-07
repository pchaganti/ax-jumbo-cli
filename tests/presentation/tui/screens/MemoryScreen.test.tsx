import React from "react";
import { describe, expect, it } from "@jest/globals";
import { render } from "ink-testing-library";
import { MemoryScreen } from "../../../../src/presentation/tui/screens/MemoryScreen.js";

describe("MemoryScreen", () => {
  it("renders the screen title", () => {
    const { lastFrame } = render(<MemoryScreen />);
    expect(lastFrame()).toContain("Memory");
  });

  it("renders placeholder description", () => {
    const { lastFrame } = render(<MemoryScreen />);
    expect(lastFrame()).toContain("Decisions");
  });
});
