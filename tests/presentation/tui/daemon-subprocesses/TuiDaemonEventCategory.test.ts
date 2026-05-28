import { describe, expect, it } from "@jest/globals";
import { TuiDaemonEventCategory } from "../../../../src/presentation/tui/daemon-subprocesses/TuiDaemonEventCategory.js";
import { TuiDaemonEventStatus } from "../../../../src/presentation/tui/daemon-subprocesses/TuiDaemonEventStatus.js";

describe("TuiDaemonEventCategory", () => {
  it("maps lifecycle event categories to daemon event status values", () => {
    expect(TuiDaemonEventCategory.MODEL_OUTPUT).toBe("model-output");
    expect(TuiDaemonEventCategory.STOPPING).toBe(TuiDaemonEventStatus.STOPPING);
    expect(TuiDaemonEventCategory.STOPPED).toBe(TuiDaemonEventStatus.STOPPED);
    expect(TuiDaemonEventCategory.FAILED).toBe(TuiDaemonEventStatus.FAILED);
  });
});
