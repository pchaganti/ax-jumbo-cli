import { describe, expect, it } from "@jest/globals";
import { TuiDaemonEventStatus, type TuiDaemonEventStatusValue } from "../../../../src/presentation/tui/daemon-subprocesses/TuiDaemonEventStatus.js";

describe("TuiDaemonEventStatus", () => {
  it("defines daemon event terminal and lifecycle status values", () => {
    expect(TuiDaemonEventStatus).toEqual({
      STARTING: "starting",
      STOPPING: "stopping",
      STOPPED: "stopped",
      FAILED: "failed",
      IDLE: "idle",
      PROCESSING: "processing",
      COMPLETED: "completed",
      SKIPPED: "skipped",
      EXHAUSTED: "exhausted",
      CODIFYING: "codifying",
    });
  });

  it("derives a typed union from the constant surface", () => {
    const terminalStatus: TuiDaemonEventStatusValue = "failed";
    const processingStatus: TuiDaemonEventStatusValue = "processing";
    expect(Object.values(TuiDaemonEventStatus)).toContain(terminalStatus);
    expect(Object.values(TuiDaemonEventStatus)).toContain(processingStatus);
  });
});
