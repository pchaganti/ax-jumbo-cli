import React from "react";
import { describe, expect, it } from "@jest/globals";
import { render } from "ink-testing-library";
import { CockpitScreen } from "../../../../src/presentation/tui/screens/CockpitScreen.js";

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
});
