import { useCallback, useContext } from "react";
import type { GetGuidelinesResponse } from "../../../application/context/guidelines/get/GetGuidelinesResponse.js";
import { TuiStateReaderContext } from "./TuiStateReaderContext.js";
import { DEFAULT_TUI_STATE_READER_TICK_MS } from "./TuiStateReaderDefaults.js";
import type { TuiStateSnapshot } from "./TuiStateSnapshot.js";
import { useTickingReadModel } from "./useTickingReadModel.js";

export function useGuidelinesList(
  category?: string,
): TuiStateSnapshot<GetGuidelinesResponse> {
  const context = useContext(TuiStateReaderContext);
  const controller = context?.controllers.getGuidelinesController;

  return useTickingReadModel<GetGuidelinesResponse>(
    useCallback(async () => {
      if (controller === undefined) {
        return null;
      }

      return controller.handle(category === undefined ? {} : { category });
    }, [category, controller]),
    controller === undefined
      ? 0
      : context?.tickMs ?? DEFAULT_TUI_STATE_READER_TICK_MS,
  );
}
