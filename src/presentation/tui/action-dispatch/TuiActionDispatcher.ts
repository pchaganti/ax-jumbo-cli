import type { TuiActionResult } from "./TuiActionResult.js";
import { TuiActionErrorNormalizer } from "./TuiActionErrorNormalizer.js";
import type { TuiRequestController } from "./TuiRequestController.js";

export const TuiActionDispatcher = {
  async dispatch<TRequest, TResponse>(
    controller: TuiRequestController<TRequest, TResponse>,
    request: TRequest,
  ): Promise<TuiActionResult<TResponse>> {
    try {
      return {
        ok: true,
        response: await controller.handle(request),
      };
    } catch (caughtError) {
      return {
        ok: false,
        error: TuiActionErrorNormalizer.normalize(caughtError),
      };
    }
  },
} as const;
