import React from "react";
import { jest, describe, expect, it } from "@jest/globals";
import { render } from "ink-testing-library";
import { CockpitLaunchpadView } from "../../../../src/presentation/tui/screens/CockpitLaunchpadView.js";
import { SubprocessManagerProvider } from "../../../../src/presentation/tui/subprocess/SubprocessManagerContext.js";
import type { ISubprocessManager, TuiDaemonConfig, TuiDaemonName, TuiSubprocessSnapshot } from "../../../../src/presentation/tui/subprocess/ISubprocessManager.js";

const tick = () => new Promise((resolve) => setTimeout(resolve, 50));
const defaultConfig = {
  agentId: "codex",
  pollIntervalMs: 30000,
  maxRetries: 3,
};

function createSnapshots(config: TuiDaemonConfig = defaultConfig): Map<TuiDaemonName, TuiSubprocessSnapshot> {
  return new Map<TuiDaemonName, TuiSubprocessSnapshot>([
    ["reviewer", { name: "reviewer", status: "stopped", config, stdout: [], stderr: [], events: [] }],
    ["refiner", { name: "refiner", status: "stopped", config, stdout: [], stderr: [], events: [] }],
    ["codifier", { name: "codifier", status: "stopped", config, stdout: [], stderr: [], events: [] }],
  ]);
}

function renderedTextPosition(frame: string, text: string): number {
  const position = frame.indexOf(text);

  if (position !== -1) {
    return position;
  }

  return frame.indexOf(text.slice(1));
}

describe("CockpitLaunchpadView daemon controls", () => {
  it("starts and stops real daemon targets through ISubprocessManager without replacing launchpad panels", async () => {
    const snapshots = createSnapshots();
    const manager: ISubprocessManager = {
      spawn: jest.fn(async (name: TuiDaemonName, config = defaultConfig) => {
        const next = {
          name,
          status: "running" as const,
          config: { ...defaultConfig, ...config },
          pid: 123,
          stdout: ["{\"daemon\":\"refiner\",\"status\":\"processing\",\"goalId\":\"goal_123456\",\"attempt\":1,\"maxRetries\":3}"],
          stderr: [],
          events: [{ daemon: "refiner", status: "processing", goalId: "goal_123456", attempt: 1, maxRetries: 3 }],
        };
        snapshots.set(name, next);
        return next;
      }),
      terminate: jest.fn(async (name: TuiDaemonName) => {
        const next = { name, status: "stopped" as const, config: defaultConfig, stdout: ["stopped"], stderr: [], events: [] };
        snapshots.set(name, next);
        return next;
      }),
      terminateAll: jest.fn(async () => {}),
      getStatus: jest.fn((name: TuiDaemonName) => snapshots.get(name)!),
      getAllStatuses: jest.fn(() => Array.from(snapshots.values())),
    };

    const { lastFrame, stdin, unmount } = render(
      <SubprocessManagerProvider manager={manager}>
        <CockpitLaunchpadView
          reviewerFrameDurationMs={0}
          refinerFrameDurationMs={0}
          codifierFrameDurationMs={0}
        />
      </SubprocessManagerProvider>,
    );

    expect(lastFrame()).toContain("PROJECT//");
    expect(lastFrame()).toContain("SESSION//");
    expect(lastFrame()).toContain("REVIEWER//");
    expect(lastFrame()).toContain("CODIFIER//");
    expect(renderedTextPosition(lastFrame() ?? "", "[r] start pid -")).toBeGreaterThanOrEqual(0);
    expect(renderedTextPosition(lastFrame() ?? "", "[v] select pid -")).toBeGreaterThanOrEqual(0);
    expect(lastFrame()).toContain("[a] codex [p] 30s [x] 3");

    const frame = lastFrame() ?? "";
    const refinerPosition = renderedTextPosition(frame, "REFINER//");
    const reviewerPosition = renderedTextPosition(frame, "REVIEWER//");
    const codifierPosition = renderedTextPosition(frame, "CODIFIER//");
    expect(refinerPosition).toBeGreaterThanOrEqual(0);
    expect(refinerPosition).toBeLessThan(reviewerPosition);
    expect(reviewerPosition).toBeLessThan(codifierPosition);

    stdin.write("r");
    await tick();
    expect(manager.spawn).toHaveBeenCalledWith("refiner", defaultConfig);
    expect(renderedTextPosition(lastFrame() ?? "", "REFINER// (running)")).toBeGreaterThanOrEqual(0);
    expect(renderedTextPosition(lastFrame() ?? "", "refining goal_123")).toBeGreaterThanOrEqual(0);

    stdin.write("r");
    await tick();
    expect(manager.terminate).toHaveBeenCalledWith("refiner");

    stdin.write("v");
    await tick();
    stdin.write("v");
    await tick();
    expect(manager.spawn).toHaveBeenCalledWith("reviewer", defaultConfig);

    stdin.write("c");
    await tick();
    stdin.write("c");
    await tick();
    expect(manager.spawn).toHaveBeenCalledWith("codifier", defaultConfig);
    unmount();
  });

  it("edits only the selected daemon config and passes that config when spawning", async () => {
    const snapshots = createSnapshots();
    const manager: ISubprocessManager = {
      spawn: jest.fn(async (name: TuiDaemonName, config = defaultConfig) => {
        const next = { name, status: "running" as const, config: { ...defaultConfig, ...config }, pid: 123, stdout: [], stderr: [], events: [] };
        snapshots.set(name, next);
        return next;
      }),
      terminate: jest.fn(async (name: TuiDaemonName) => snapshots.get(name)!),
      terminateAll: jest.fn(async () => {}),
      getStatus: jest.fn((name: TuiDaemonName) => snapshots.get(name)!),
      getAllStatuses: jest.fn(() => Array.from(snapshots.values())),
    };

    const { lastFrame, stdin, unmount } = render(
      <SubprocessManagerProvider manager={manager}>
        <CockpitLaunchpadView
          reviewerFrameDurationMs={0}
          refinerFrameDurationMs={0}
          codifierFrameDurationMs={0}
        />
      </SubprocessManagerProvider>,
    );

    stdin.write("a");
    await tick();
    stdin.write("p");
    await tick();
    stdin.write("x");
    await tick();

    expect(renderedTextPosition(lastFrame() ?? "", "[a] claude [p] 60s [x] 5")).toBeGreaterThanOrEqual(0);
    expect(renderedTextPosition(lastFrame() ?? "", "[v] select pid -")).toBeGreaterThanOrEqual(0);
    stdin.write("v");
    await tick();
    expect(renderedTextPosition(lastFrame() ?? "", "[v] start pid -")).toBeGreaterThanOrEqual(0);
    expect(lastFrame()).toContain("[a] codex [p] 30s [x] 3");
    stdin.write("a");
    await tick();
    expect(renderedTextPosition(lastFrame() ?? "", "[a] claude [p] 30s [x] 3")).toBeGreaterThanOrEqual(0);
    stdin.write("r");
    await tick();
    expect(renderedTextPosition(lastFrame() ?? "", "[r] start pid -")).toBeGreaterThanOrEqual(0);
    expect(renderedTextPosition(lastFrame() ?? "", "[a] claude [p] 60s [x] 5")).toBeGreaterThanOrEqual(0);
    stdin.write("r");
    await tick();
    expect(manager.spawn).toHaveBeenCalledWith("refiner", {
      agentId: "claude",
      pollIntervalMs: 60000,
      maxRetries: 5,
    });
    stdin.write("v");
    await tick();
    stdin.write("v");
    await tick();
    expect(manager.spawn).toHaveBeenCalledWith("reviewer", {
      agentId: "claude",
      pollIntervalMs: 30000,
      maxRetries: 3,
    });
    expect(manager.spawn).not.toHaveBeenCalledWith("codifier", expect.anything());
    expect(renderedTextPosition(lastFrame() ?? "", "[c] select pid -")).toBeGreaterThanOrEqual(0);
    expect(lastFrame()).toContain("[a] codex [p] 30s [x] 3");
    unmount();
  });

  it("does not mutate pending config when stopping a daemon", async () => {
    const snapshots = createSnapshots();
    const runningConfig = {
      agentId: "claude",
      pollIntervalMs: 60000,
      maxRetries: 5,
    };
    const manager: ISubprocessManager = {
      spawn: jest.fn(async (name: TuiDaemonName, config = defaultConfig) => {
        const next = { name, status: "running" as const, config: { ...config }, pid: 123, stdout: [], stderr: [], events: [] };
        snapshots.set(name, next);
        return next;
      }),
      terminate: jest.fn(async (name: TuiDaemonName) => {
        const next = { name, status: "stopped" as const, config: defaultConfig, stdout: ["stopped"], stderr: [], events: [] };
        snapshots.set(name, next);
        return next;
      }),
      terminateAll: jest.fn(async () => {}),
      getStatus: jest.fn((name: TuiDaemonName) => snapshots.get(name)!),
      getAllStatuses: jest.fn(() => Array.from(snapshots.values())),
    };

    const { lastFrame, stdin, unmount } = render(
      <SubprocessManagerProvider manager={manager}>
        <CockpitLaunchpadView
          reviewerFrameDurationMs={0}
          refinerFrameDurationMs={0}
          codifierFrameDurationMs={0}
        />
      </SubprocessManagerProvider>,
    );

    stdin.write("a");
    await tick();
    stdin.write("p");
    await tick();
    stdin.write("x");
    await tick();
    stdin.write("r");
    await tick();
    expect(manager.spawn).toHaveBeenCalledWith("refiner", runningConfig);

    stdin.write("r");
    await tick();
    expect(manager.terminate).toHaveBeenCalledWith("refiner");
    expect(renderedTextPosition(lastFrame() ?? "", "[a] claude [p] 60s [x] 5")).toBeGreaterThanOrEqual(0);
    unmount();
  });
});
