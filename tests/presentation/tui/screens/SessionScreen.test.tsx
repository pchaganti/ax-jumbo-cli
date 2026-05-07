import React from "react";
import { describe, expect, it } from "@jest/globals";
import { render } from "ink-testing-library";
import { SessionScreen } from "../../../../src/presentation/tui/screens/SessionScreen.js";

describe("SessionScreen", () => {
  it("renders the screen title", () => {
    const { lastFrame } = render(<SessionScreen />);
    expect(lastFrame()).toContain("Session");
  });

  it("renders placeholder description", () => {
    const { lastFrame } = render(<SessionScreen />);
    expect(lastFrame()).toContain("session focus");
  });
});
