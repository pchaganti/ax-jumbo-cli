import { useCallback, useContext } from "react";
import type { ProjectStatsController } from "../../../application/context/project/stats/ProjectStatsController.js";
import type { ProjectStatsResponse } from "../../../application/context/project/stats/ProjectStatsResponse.js";
import { TuiStateReaderContext } from "./TuiStateReaderContext.js";
import { DEFAULT_TUI_STATE_READER_TICK_MS } from "./TuiStateReaderDefaults.js";
import type { TuiStateSnapshot } from "./TuiStateSnapshot.js";
import { useTickingReadModel } from "./useTickingReadModel.js";

export function useProjectStats(): TuiStateSnapshot<ProjectStatsResponse> {
  const context = useContext(TuiStateReaderContext);
  const controller = context?.controllers.projectStatsController as
    | Pick<ProjectStatsController, "handle">
    | undefined;

  return useTickingReadModel<ProjectStatsResponse>(
    useCallback(async () => {
      if (controller === undefined) {
        return null;
      }

      return controller.handle({ currentOnly: true });
    }, [controller]),
    controller === undefined
      ? 0
      : context?.tickMs ?? DEFAULT_TUI_STATE_READER_TICK_MS,
  );
}
