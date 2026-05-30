import { describe, expect, it } from "@jest/globals";
import type { TuiActionResult } from "../../../../src/presentation/tui/action-dispatch/TuiActionResult.js";

describe("TuiActionResult", () => {
  it("represents successful action responses", () => {
    const result: TuiActionResult<{ readonly value: string }> = {
      ok: true,
      response: { value: "accepted" },
    };

    expect(result).toEqual({
      ok: true,
      response: { value: "accepted" },
    });
  });

  it("represents failed action responses", () => {
    const error = new Error("Rejected");
    const result: TuiActionResult<{ readonly value: string }> = {
      ok: false,
      error,
    };

    expect(result).toEqual({
      ok: false,
      error,
    });
  });
});
