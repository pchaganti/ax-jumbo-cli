import { describe, expect, it, jest } from "@jest/globals";
import type { ISubprocessManager } from "../../../../src/presentation/tui/daemon-subprocesses/ISubprocessManager.js";
import type { TuiDaemonConfig } from "../../../../src/presentation/tui/daemon-subprocesses/TuiDaemonConfig.js";
import type { TuiDaemonName } from "../../../../src/presentation/tui/daemon-subprocesses/TuiDaemonName.js";
import type { TuiSubprocessSnapshot } from "../../../../src/presentation/tui/daemon-subprocesses/TuiSubprocessSnapshot.js";

const config: TuiDaemonConfig = {
  agentId: "codex",
  pollIntervalMs: 30000,
  maxRetries: 3,
};

const snapshot: TuiSubprocessSnapshot = {
  name: "refiner",
  status: "running",
  config,
  stdout: [],
  stderr: [],
  events: [],
};

describe("ISubprocessManager", () => {
  it("defines the subprocess-control contract around explicit daemon snapshot concepts", async () => {
    const manager: ISubprocessManager = {
      spawn: jest.fn(async (_name: TuiDaemonName, _config?: Partial<TuiDaemonConfig>) => snapshot),
      terminate: jest.fn(async (_name: TuiDaemonName) => ({ ...snapshot, status: "stopped" })),
      terminateAll: jest.fn<() => Promise<void>>().mockResolvedValue(),
      getStatus: jest.fn((_name: TuiDaemonName) => snapshot),
      getAllStatuses: jest.fn(() => [snapshot]),
    };

    await expect(manager.spawn("refiner", { pollIntervalMs: 10000 })).resolves.toEqual(snapshot);
    expect(manager.getStatus("refiner")).toBe(snapshot);
    expect(manager.getAllStatuses()).toEqual([snapshot]);
  });
});
