import { describe, expect, it } from "@jest/globals";
import type { TuiDaemonName } from "../../../../src/presentation/tui/daemon-subprocesses/TuiDaemonName.js";

describe("TuiDaemonName", () => {
  it("aliases the worker daemon name union used by TUI subprocess controls", () => {
    const names: readonly TuiDaemonName[] = ["refiner", "reviewer", "codifier"];

    expect(names).toEqual(["refiner", "reviewer", "codifier"]);
  });
});
