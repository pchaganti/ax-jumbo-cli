import React from "react";
import { describe, expect, it, jest } from "@jest/globals";
import { render } from "ink-testing-library";
import { Header } from "../../../../src/presentation/tui/components/Header.js";
import { SCREEN_DEFINITIONS } from "../../../../src/presentation/tui/ScreenDefinitions.js";

describe("Header", () => {
  it("renders all screen labels", () => {
    const { lastFrame } = render(
      <Header activeScreenIndex={0} onScreenChange={() => {}} terminalWidth={80} />,
    );
    for (const screen of SCREEN_DEFINITIONS) {
      expect(lastFrame()).toContain(screen.label);
    }
  });

  it("renders shortcut numbers next to labels", () => {
    const { lastFrame } = render(
      <Header activeScreenIndex={0} onScreenChange={() => {}} terminalWidth={80} />,
    );
    for (const screen of SCREEN_DEFINITIONS) {
      expect(lastFrame()).toContain(screen.shortcut);
    }
  });

  it("shows selector glyph on the active screen", () => {
    const { lastFrame } = render(
      <Header activeScreenIndex={0} onScreenChange={() => {}} terminalWidth={80} />,
    );
    expect(lastFrame()).toContain("▸");
  });

  it("navigates right on right arrow key", () => {
    const onScreenChange = jest.fn();
    const { stdin } = render(
      <Header activeScreenIndex={0} onScreenChange={onScreenChange} terminalWidth={80} />,
    );
    stdin.write("\x1B[C");
    expect(onScreenChange).toHaveBeenCalledWith(1);
  });

  it("navigates left on left arrow key", () => {
    const onScreenChange = jest.fn();
    const { stdin } = render(
      <Header activeScreenIndex={2} onScreenChange={onScreenChange} terminalWidth={80} />,
    );
    stdin.write("\x1B[D");
    expect(onScreenChange).toHaveBeenCalledWith(1);
  });

  it("does not navigate left past the first screen", () => {
    const onScreenChange = jest.fn();
    const { stdin } = render(
      <Header activeScreenIndex={0} onScreenChange={onScreenChange} terminalWidth={80} />,
    );
    stdin.write("\x1B[D");
    expect(onScreenChange).not.toHaveBeenCalled();
  });

  it("does not navigate right past the last screen", () => {
    const onScreenChange = jest.fn();
    const { stdin } = render(
      <Header
        activeScreenIndex={SCREEN_DEFINITIONS.length - 1}
        onScreenChange={onScreenChange}
        terminalWidth={80}
      />,
    );
    stdin.write("\x1B[C");
    expect(onScreenChange).not.toHaveBeenCalled();
  });

  it("jumps to screen on number key press", () => {
    const onScreenChange = jest.fn();
    const { stdin } = render(
      <Header activeScreenIndex={0} onScreenChange={onScreenChange} terminalWidth={80} />,
    );
    stdin.write("3");
    expect(onScreenChange).toHaveBeenCalledWith(2);
  });

  it("renders a divider line spanning terminal width", () => {
    const { lastFrame } = render(
      <Header activeScreenIndex={0} onScreenChange={() => {}} terminalWidth={40} />,
    );
    expect(lastFrame()).toContain("─".repeat(40));
  });

  it("ignores number keys outside screen range", () => {
    const onScreenChange = jest.fn();
    const { stdin } = render(
      <Header activeScreenIndex={0} onScreenChange={onScreenChange} terminalWidth={80} />,
    );
    stdin.write("9");
    expect(onScreenChange).not.toHaveBeenCalled();
  });
});
