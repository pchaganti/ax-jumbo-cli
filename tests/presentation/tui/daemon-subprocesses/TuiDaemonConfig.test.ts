import { describe, expect, it } from "@jest/globals";
import type {
  TuiDaemonConfig,
  TuiDaemonConfigs,
} from "../../../../src/presentation/tui/daemon-subprocesses/TuiDaemonConfig.js";
import type { TuiDaemonName } from "../../../../src/presentation/tui/daemon-subprocesses/TuiDaemonName.js";

describe("TuiDaemonConfig", () => {
  it("aliases the worker daemon runtime configuration contract for TUI consumers", () => {
    const config: TuiDaemonConfig = {
      agentId: "codex",
      pollIntervalMs: 30000,
      maxRetries: 3,
    };
    const configs: TuiDaemonConfigs = {
      refiner: config,
      reviewer: config,
      codifier: config,
    };

    expect(configs.refiner).toEqual(config);
    expect(Object.keys(configs)).toEqual(["refiner", "reviewer", "codifier"] satisfies TuiDaemonName[]);
  });
});
