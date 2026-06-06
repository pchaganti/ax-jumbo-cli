import { useCallback, useContext } from "react";
import type { GetDecisionsResponse } from "../../../application/context/decisions/get/GetDecisionsResponse.js";
import type { DecisionStatusFilter } from "../../../application/context/decisions/get/IDecisionViewReader.js";
import { DecisionStatus } from "../../../domain/decisions/Constants.js";
import { TuiStateReaderContext } from "./TuiStateReaderContext.js";
import { DEFAULT_TUI_STATE_READER_TICK_MS } from "./TuiStateReaderDefaults.js";
import type { TuiStateSnapshot } from "./TuiStateSnapshot.js";
import { useTickingReadModel } from "./useTickingReadModel.js";

export function useDecisionsList(
  status: DecisionStatusFilter = DecisionStatus.ACTIVE,
): TuiStateSnapshot<GetDecisionsResponse> {
  const context = useContext(TuiStateReaderContext);
  const controller = context?.controllers.getDecisionsController;

  return useTickingReadModel<GetDecisionsResponse>(
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
