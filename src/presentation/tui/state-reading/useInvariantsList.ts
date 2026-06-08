import { useCallback, useContext } from "react";
import type { GetAllInvariantsResponse } from "../../../application/context/invariants/get/GetAllInvariantsResponse.js";
import { TuiStateReaderContext } from "./TuiStateReaderContext.js";
import { DEFAULT_TUI_STATE_READER_TICK_MS } from "./TuiStateReaderDefaults.js";
import type { TuiStateSnapshot } from "./TuiStateSnapshot.js";
import { useTickingReadModel } from "./useTickingReadModel.js";

export function useInvariantsList(): TuiStateSnapshot<GetAllInvariantsResponse> {
  const context = useContext(TuiStateReaderContext);
  const controller = context?.controllers.getInvariantsController;

  return useTickingReadModel<GetAllInvariantsResponse>(
    useCallback(async () => {
      if (controller === undefined) {
        return null;
      }

      return controller.getAllInvariants({});
    }, [controller]),
    controller === undefined
      ? 0
      : context?.tickMs ?? DEFAULT_TUI_STATE_READER_TICK_MS,
  );
}
