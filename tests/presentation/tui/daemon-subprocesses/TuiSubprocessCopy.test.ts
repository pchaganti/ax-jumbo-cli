import { describe, expect, it } from "@jest/globals";
import { TuiSubprocessCopy } from "../../../../src/presentation/tui/daemon-subprocesses/TuiSubprocessCopy.js";

describe("TuiSubprocessCopy", () => {
  it("defines the expected copy keys for lifecycle and log behaviors", () => {
    expect(TuiSubprocessCopy).toHaveProperty("terminationRequested");
    expect(TuiSubprocessCopy).toHaveProperty("processStopped");
    expect(TuiSubprocessCopy).toHaveProperty("processFailed");
    expect(TuiSubprocessCopy).toHaveProperty("spawnRequestedLog");
    expect(TuiSubprocessCopy).toHaveProperty("startedLog");
    expect(TuiSubprocessCopy).toHaveProperty("stdoutLog");
    expect(TuiSubprocessCopy).toHaveProperty("stderrLog");
    expect(TuiSubprocessCopy).toHaveProperty("closedLog");
    expect(TuiSubprocessCopy).toHaveProperty("errorLog");
    expect(TuiSubprocessCopy).toHaveProperty("terminationRequestedLog");
    expect(TuiSubprocessCopy).toHaveProperty("terminationCompletedLog");
    expect(TuiSubprocessCopy).toHaveProperty("terminationFailedLog");
    expect(TuiSubprocessCopy).toHaveProperty("eventLog");
  });

  it("keeps all expected log tokens non-empty for render and diagnostics", () => {
    for (const value of Object.values(TuiSubprocessCopy)) {
      expect(typeof value).toBe("string");
      expect(value.length).toBeGreaterThan(0);
    }
  });
});
