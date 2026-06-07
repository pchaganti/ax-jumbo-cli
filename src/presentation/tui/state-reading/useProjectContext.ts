import { useCallback, useContext } from "react";
import type { ProjectSummaryView } from "../../../application/context/project/ProjectSummaryView.js";
import { TuiStateReaderContext } from "./TuiStateReaderContext.js";
import { DEFAULT_TUI_STATE_READER_TICK_MS } from "./TuiStateReaderDefaults.js";
import type { TuiStateSnapshot } from "./TuiStateSnapshot.js";
import { useTickingReadModel } from "./useTickingReadModel.js";

export function useProjectContext(): TuiStateSnapshot<ProjectSummaryView> {
  const context = useContext(TuiStateReaderContext);
  const controller = context?.controllers.getProjectSummaryQueryHandler;

  return useTickingReadModel<ProjectSummaryView>(
    useCallback(async () => {
      if (controller === undefined) {
        return null;
      }

      return controller.execute();
    }, [controller]),
    controller === undefined
      ? 0
      : context?.tickMs ?? DEFAULT_TUI_STATE_READER_TICK_MS,
  );
}
