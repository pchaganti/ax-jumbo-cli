import { useCallback, useContext } from "react";
import type { GetGoalsRequest } from "../../../application/context/goals/get/GetGoalsRequest.js";
import type { GetGoalsResponse } from "../../../application/context/goals/get/GetGoalsResponse.js";
import type { GoalStatusType } from "../../../domain/goals/Constants.js";
import { TuiStateReaderContext } from "./TuiStateReaderContext.js";
import { DEFAULT_TUI_STATE_READER_TICK_MS } from "./TuiStateReaderDefaults.js";
import type { TuiStateSnapshot } from "./TuiStateSnapshot.js";
import { useTickingReadModel } from "./useTickingReadModel.js";

export function useGoalsList(
  statusFilter?: GoalStatusType,
): TuiStateSnapshot<GetGoalsResponse> {
  const context = useContext(TuiStateReaderContext);
  const controller = context?.controllers.getGoalsController;

  return useTickingReadModel<GetGoalsResponse>(
    useCallback(async () => {
      if (controller === undefined) {
        return null;
      }

      const request: GetGoalsRequest =
        statusFilter === undefined ? {} : { statuses: [statusFilter] };
      return controller.handle(request);
    }, [controller, statusFilter]),
    controller === undefined
      ? 0
      : context?.tickMs ?? DEFAULT_TUI_STATE_READER_TICK_MS,
  );
}
