import { describe, expect, it } from "@jest/globals";
import { getCodifierFrame } from "../../../../src/presentation/tui/cockpit/CockpitLaunchpadView.js";

describe("getCodifierFrame", () => {
  it("renders 10 rows of 35 characters", () => {
    const frame = getCodifierFrame(0);

    expect(frame).toHaveLength(10);
    for (const line of frame) {
      expect(line).toHaveLength(35);
    }
  });

  it("uses uppercase alphanumeric groups followed by a dot with no repeats per line", () => {
    const frame = getCodifierFrame(0);

    for (const line of frame) {
      expect(line).toMatch(/^(?:[A-Z0-9]{4}\.){7}$/);

      const groups = line.match(/[A-Z0-9]{4}(?=\.)/g);
      expect(groups).not.toBeNull();
      expect(new Set(groups!).size).toBe(7);
    }
  });

  it("is deterministic per frame index and varies across frames", () => {
    const firstFrame = getCodifierFrame(0);
    const repeatedFrame = getCodifierFrame(0);
    const nextFrame = getCodifierFrame(1);

    expect(repeatedFrame).toEqual(firstFrame);
    expect(nextFrame).not.toEqual(firstFrame);
  });
});