import React from "react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Text } from "ink";
import { render } from "ink-testing-library";
import { BaseColors } from "../../../../../src/presentation/shared/DesignTokens.js";
import { TuiSubprocessStatus } from "../../../../../src/presentation/tui/daemon-subprocesses/TuiSubprocessStatus.js";
import type { IDaemonFrame } from "../../../../../src/presentation/tui/cockpit/daemons/IDaemonFrame.js";

const reviewerFrame = [[{ glyph: "v", color: BaseColors.shade1 }]] as const;
const mockGetReviewerFrame = jest.fn(() => reviewerFrame);
const mockGlyphCellDaemonFrame = jest.fn(() => <Text>REVIEWER_FRAME</Text>);

jest.unstable_mockModule(
  "../../../../../src/presentation/tui/cockpit/CockpitDaemonFrames.js",
  () => ({
    getReviewerFrame: mockGetReviewerFrame,
  }),
);

jest.unstable_mockModule(
  "../../../../../src/presentation/tui/cockpit/GlyphCellDaemonFrame.js",
  () => ({
    GlyphCellDaemonFrame: mockGlyphCellDaemonFrame,
  }),
);

const ReviewerDaemonFrameModule = await import(
  "../../../../../src/presentation/tui/cockpit/daemons/ReviewerDaemonFrame.js"
);

const { ReviewerDaemonFrame } = ReviewerDaemonFrameModule;

const runningSnapshot = {
  status: TuiSubprocessStatus.RUNNING,
  events: [],
} as const;

describe("ReviewerDaemonFrame", () => {
  beforeEach(() => {
    mockGetReviewerFrame.mockClear();
    mockGlyphCellDaemonFrame.mockClear();
  });

  it("exports only the reviewer daemon frame concept", () => {
    expect(Object.keys(ReviewerDaemonFrameModule)).toEqual([
      "ReviewerDaemonFrame",
    ]);
  });

  it("selects the reviewer frame and passes glyph cell rendering inputs", () => {
    const reviewerGlyphPalette = [
      BaseColors.shade1,
      BaseColors.shade2,
    ] as const;
    const props: IDaemonFrame = {
      frameIndex: 5,
      snapshot: runningSnapshot,
      statusLabel: "RUN",
      refinerGlyphPalette: [],
      reviewerGlyphPalette,
      codifierGlyphColors: {},
    };

    const { lastFrame, unmount } = render(<ReviewerDaemonFrame {...props} />);

    expect(lastFrame()).toContain("REVIEWER_FRAME");
    expect(mockGetReviewerFrame).toHaveBeenCalledWith(
      props.frameIndex,
      reviewerGlyphPalette,
    );
    expect(mockGlyphCellDaemonFrame.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({
        frame: reviewerFrame,
        frameIndex: props.frameIndex,
        snapshot: runningSnapshot,
        statusLabel: props.statusLabel,
      }),
    );
    unmount();
  });
});
