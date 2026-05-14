import React from "react";
import { describe, expect, it } from "@jest/globals";
import { render } from "ink-testing-library";
import { TuiApp } from "../../../src/presentation/tui/TuiApp.js";

const tick = () => new Promise((resolve) => setTimeout(resolve, 50));

describe("TuiApp", () => {
  it("renders a non-empty frame on mount", () => {
    const { lastFrame } = render(<TuiApp />);
    expect((lastFrame() ?? "").length).toBeGreaterThan(0);
  });

  it("changes frame when m is pressed (MegaMenu toggles open)", async () => {
    const { stdin, lastFrame } = render(<TuiApp />);
    const before = lastFrame();
    stdin.write("m");
    await tick();
    expect(lastFrame()).not.toBe(before);
  });

  it("MegaMenu closes on escape and returns to prior frame", async () => {
    const { stdin, lastFrame } = render(<TuiApp />);
    const initial = lastFrame();
    stdin.write("m");
    await tick();
    expect(lastFrame()).not.toBe(initial);
    stdin.write("\x1B");
    await tick();
    expect(lastFrame()).toBe(initial);
  });

  it("q does not quit while MegaMenu is open", async () => {
    const { stdin, lastFrame } = render(<TuiApp />);
    stdin.write("m");
    await tick();
    const open = lastFrame();
    stdin.write("q");
    await tick();
    expect(lastFrame()).toBe(open);
  });
});
