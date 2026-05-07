import React from "react";
import { describe, expect, it } from "@jest/globals";
import { render } from "ink-testing-library";
import { TuiApp } from "../../../src/presentation/tui/TuiApp.js";

describe("TuiApp", () => {
  it("renders header with screen labels", () => {
    const { lastFrame } = render(<TuiApp />);
    const frame = lastFrame()!;
    expect(frame).toContain("Cockpit");
    expect(frame).toContain("Goals");
    expect(frame).toContain("Memory");
    expect(frame).toContain("Session");
  });

  it("renders footer with keybinding hints", () => {
    const { lastFrame } = render(<TuiApp />);
    expect(lastFrame()).toContain("navigate");
    expect(lastFrame()).toContain("quit");
  });

  it("renders footer with daemon health placeholder", () => {
    const { lastFrame } = render(<TuiApp />);
    expect(lastFrame()).toContain("daemons");
  });

  it("shows Cockpit screen by default", () => {
    const { lastFrame } = render(<TuiApp />);
    expect(lastFrame()).toContain("Project orientation");
  });

  it("switches screen on number key press", async () => {
    const { stdin, lastFrame } = render(<TuiApp />);
    stdin.write("2");
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(lastFrame()).toContain("Goal backlog");
  });

  it("switches screen on arrow key navigation", async () => {
    const { stdin, lastFrame } = render(<TuiApp />);
    stdin.write("\x1B[C");
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(lastFrame()).toContain("Goal backlog");
  });
});
