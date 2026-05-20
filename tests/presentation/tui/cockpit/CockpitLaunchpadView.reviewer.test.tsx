import React from "react";
import { describe, expect, it } from "@jest/globals";
import { render } from "ink-testing-library";
import {
  CockpitLaunchpadView,
  getReviewerFrame,
} from "../../../../src/presentation/tui/cockpit/CockpitLaunchpadView.js";

describe("getReviewerFrame", () => {
  it("renders 10 rows of 35 reviewer glyphs", () => {
    const frame = getReviewerFrame(0);

    expect(frame).toHaveLength(10);
    for (const line of frame) {
      expect(line).toHaveLength(35);
      expect(line).toMatch(/^[◇◆□■△▽○]+$/);
      expect(line).not.toContain("•");
    }
  });

  it("falls back to an error frame for invalid frame indexes", () => {
    expect(getReviewerFrame(-1)).toEqual(["error"]);
    expect(getReviewerFrame(6)).toEqual(["error"]);
  });

  it("is deterministic per frame index and varies across frames", () => {
    const firstFrame = getReviewerFrame(0);
    const repeatedFrame = getReviewerFrame(0);
    const nextFrame = getReviewerFrame(1);

    expect(repeatedFrame).toEqual(firstFrame);
    expect(nextFrame).not.toEqual(firstFrame);
  });
});

describe("CockpitLaunchpadView reviewer panel", () => {
  it("continues rendering the Reviewer panel with its generated animation", () => {
    const { lastFrame, unmount } = render(
      <CockpitLaunchpadView
        reviewerFrameDurationMs={0}
        refinerFrameDurationMs={0}
        codifierFrameDurationMs={0}
      />,
    );

    const frame = lastFrame() ?? "";
    expect(frame).toContain("REVIEWER//");
    expect(frame).toMatch(/[◇◆□■△▽○]/);

    unmount();
  });
});
