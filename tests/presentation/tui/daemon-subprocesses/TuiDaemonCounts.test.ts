import { describe, expect, it } from "@jest/globals";
import type { TuiDaemonCounts } from "../../../../src/presentation/tui/daemon-subprocesses/TuiDaemonCounts.js";

describe("TuiDaemonCounts", () => {
  it("captures subprocess totals by status", () => {
    const counts: TuiDaemonCounts = {
      running: 1,
      stopped: 1,
      failed: 1,
    };

    expect(counts.running + counts.stopped + counts.failed).toBe(3);
  });
});
