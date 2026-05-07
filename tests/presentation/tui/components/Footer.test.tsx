import React from "react";
import { describe, expect, it } from "@jest/globals";
import { render } from "ink-testing-library";
import { Footer } from "../../../../src/presentation/tui/components/Footer.js";

describe("Footer", () => {
  it("renders keybinding hints", () => {
    const { lastFrame } = render(<Footer terminalWidth={80} />);
    const frame = lastFrame()!;
    expect(frame).toContain("navigate");
    expect(frame).toContain("quit");
  });

  it("renders daemon health placeholder", () => {
    const { lastFrame } = render(<Footer terminalWidth={80} />);
    expect(lastFrame()).toContain("daemons");
    expect(lastFrame()).toContain("idle");
  });

  it("renders a divider line spanning terminal width", () => {
    const { lastFrame } = render(<Footer terminalWidth={40} />);
    expect(lastFrame()).toContain("─".repeat(40));
  });
});
