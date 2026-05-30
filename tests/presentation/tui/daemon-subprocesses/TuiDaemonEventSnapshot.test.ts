import { describe, expect, it } from "@jest/globals";
import type { TuiDaemonEventSnapshot } from "../../../../src/presentation/tui/daemon-subprocesses/TuiDaemonEventSnapshot.js";

describe("TuiDaemonEventSnapshot", () => {
  it("captures daemon event status and optional progress metadata", () => {
    const event: TuiDaemonEventSnapshot = {
      daemon: "refiner",
      status: "processing",
      source: "refiner",
      category: "model-output",
      message: "updated goal context",
      timestampMs: 1767272400000,
      goalId: "goal_123",
      attempt: 1,
      maxRetries: 3,
    };

    expect(event).toEqual(expect.objectContaining({
      daemon: "refiner",
      status: "processing",
      goalId: "goal_123",
    }));
  });
});
