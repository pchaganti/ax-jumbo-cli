import React from "react";
import { describe, expect, it } from "@jest/globals";
import { render } from "ink-testing-library";
import { Footer } from "../../../../src/presentation/tui/application-shell/Footer.js";

const tick = () => new Promise((resolve) => setTimeout(resolve, 50));

describe("Footer", () => {
  it("renders a non-empty frame", () => {
    const { lastFrame } = render(<Footer terminalWidth={80} />);
    expect((lastFrame() ?? "").trim().length).toBeGreaterThan(0);
  });

  it("toggles the notification drawer with n", async () => {
    const { lastFrame, stdin } = render(<Footer terminalWidth={80} />);

    stdin.write("n");
    await tick();
    expect(lastFrame()).toContain("Notifications");

    stdin.write("n");
    await tick();
    expect(lastFrame()).not.toContain("Notifications");
  });

  it("renders an empty notification drawer without placeholder daemon alerts", async () => {
    const { lastFrame, stdin } = render(<Footer terminalWidth={80} />);

    stdin.write("n");
    await tick();

    expect(lastFrame()).toContain("No notifications");
  });

  it("does not toggle the notification drawer when shortcuts are disabled", async () => {
    const { lastFrame, stdin } = render(
      <Footer terminalWidth={80} shortcutsEnabled={false} />,
    );

    stdin.write("n");
    await tick();

    expect(lastFrame()).not.toContain("Notifications");
  });
});
