import React from "react";
import { describe, expect, it } from "@jest/globals";
import { render } from "ink-testing-library";
import { CockpitScreen } from "../../../../src/presentation/tui/screens/CockpitScreen.js";
import { CockpitUnprimedView } from "../../../../src/presentation/tui/screens/CockpitUnprimedView.js";

describe("CockpitScreen", () => {
  it.each(["uninitialized", "unprimed", "primed-empty", "primed"] as const)(
    "renders without crashing for state=%s",
    (state) => {
      const { lastFrame, unmount } = render(<CockpitScreen state={state} />);
      expect((lastFrame() ?? "").length).toBeGreaterThan(0);
      unmount();
    },
  );

  it("renders without crashing when state is omitted", () => {
    const { lastFrame, unmount } = render(<CockpitScreen />);
    expect((lastFrame() ?? "").length).toBeGreaterThan(0);
    unmount();
  });

  it("renders a local skip affordance on the unprimed view", () => {
    const { lastFrame, unmount } = render(<CockpitUnprimedView />);
    expect(lastFrame()).toContain("skip this screen for now");
    unmount();
  });
});
