import { useCallback, useContext } from "react";
import type { GetSessionsResponse } from "../../../application/context/sessions/get/GetSessionsResponse.js";
import type { SessionStatusFilter } from "../../../application/context/sessions/get/ISessionViewReader.js";
import { TuiStateReaderContext } from "./TuiStateReaderContext.js";
import { DEFAULT_TUI_STATE_READER_TICK_MS } from "./TuiStateReaderDefaults.js";
import type { TuiStateSnapshot } from "./TuiStateSnapshot.js";
import { useTickingReadModel } from "./useTickingReadModel.js";

export function useSessionsList(
  status: SessionStatusFilter = "all",
): TuiStateSnapshot<GetSessionsResponse> {
  const context = useContext(TuiStateReaderContext);
  const controller = context?.controllers.getSessionsController;

  return useTickingReadModel<GetSessionsResponse>(
    useCallback(async () => {
      if (controller === undefined) {
        return null;
      }

      return controller.handle({ status });
    }, [controller, status]),
    controller === undefined
      ? 0
      : context?.tickMs ?? DEFAULT_TUI_STATE_READER_TICK_MS,
  );
}
