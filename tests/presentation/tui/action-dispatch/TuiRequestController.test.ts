import { describe, expect, it } from "@jest/globals";
import type { TuiRequestController } from "../../../../src/presentation/tui/action-dispatch/TuiRequestController.js";

describe("TuiRequestController", () => {
  it("defines the async request handling contract", async () => {
    const controller: TuiRequestController<
      { readonly value: string },
      { readonly echoed: string }
    > = {
      handle: async (request) => ({ echoed: request.value }),
    };

    await expect(controller.handle({ value: "request" })).resolves.toEqual({
      echoed: "request",
    });
  });
});
