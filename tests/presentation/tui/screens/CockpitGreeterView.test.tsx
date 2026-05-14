import React from "react";
import { describe, expect, it } from "@jest/globals";
import { render } from "ink-testing-library";
import { CockpitGreeterView } from "../../../../src/presentation/tui/screens/CockpitGreeterView.js";

describe("CockpitGreeterView", () => {
  it("renders the welcome message", () => {
    const { lastFrame } = render(<CockpitGreeterView />);
    expect(lastFrame()).toContain("Hi, I'm Jumbo");
  });

  it("explains what Jumbo does", () => {
    const { lastFrame } = render(<CockpitGreeterView />);
    expect(lastFrame()).toContain("memory");
  });

  it("renders the initialize key indicator", () => {
    const { lastFrame } = render(<CockpitGreeterView />);
    expect(lastFrame()).toMatch(/Press[\s\S]*to initialize/);
  });

  it("renders the initialize call-to-action", () => {
    const { lastFrame } = render(<CockpitGreeterView />);
    expect(lastFrame()).toContain("to initialize");
  });

  it("renders the terminal alternative", () => {
    const { lastFrame } = render(<CockpitGreeterView />);
    expect(lastFrame()).toContain("jumbo init");
  });
});
