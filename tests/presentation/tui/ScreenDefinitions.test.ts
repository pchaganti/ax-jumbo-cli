import { describe, expect, it } from "@jest/globals";
import {
  SCREEN_DEFINITIONS,
  DEFAULT_SCREEN_INDEX,
} from "../../../src/presentation/tui/ScreenDefinitions.js";

describe("ScreenDefinitions", () => {
  it("defines four screens", () => {
    expect(SCREEN_DEFINITIONS).toHaveLength(4);
  });

  it("assigns unique shortcut keys", () => {
    const shortcuts = SCREEN_DEFINITIONS.map((s) => s.shortcut);
    expect(new Set(shortcuts).size).toBe(shortcuts.length);
  });

  it("assigns unique keys", () => {
    const keys = SCREEN_DEFINITIONS.map((s) => s.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("defaults to the first screen", () => {
    expect(DEFAULT_SCREEN_INDEX).toBe(0);
  });
});
