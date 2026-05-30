import { describe, expect, it } from "@jest/globals";
import { TuiActionErrorNormalizer } from "../../../../src/presentation/tui/action-dispatch/TuiActionErrorNormalizer.js";

describe("TuiActionErrorNormalizer", () => {
  it("returns thrown Error values unchanged", () => {
    const expectedError = new Error("Request failed");

    expect(TuiActionErrorNormalizer.normalize(expectedError)).toBe(expectedError);
  });

  it("normalizes non-Error thrown values to Error", () => {
    const result = TuiActionErrorNormalizer.normalize("Request failed");

    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe("Request failed");
  });
});
