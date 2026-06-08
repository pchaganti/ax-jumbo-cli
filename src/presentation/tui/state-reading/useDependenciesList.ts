import { useCallback, useContext } from "react";
import type { GetDependenciesResponse } from "../../../application/context/dependencies/get/GetDependenciesResponse.js";
import type { DependencyListFilter } from "../../../application/context/dependencies/get/IDependencyViewReader.js";
import { TuiStateReaderContext } from "./TuiStateReaderContext.js";
import { DEFAULT_TUI_STATE_READER_TICK_MS } from "./TuiStateReaderDefaults.js";
import type { TuiStateSnapshot } from "./TuiStateSnapshot.js";
import { useTickingReadModel } from "./useTickingReadModel.js";

export function useDependenciesList(
  filter?: DependencyListFilter,
): TuiStateSnapshot<GetDependenciesResponse> {
  const context = useContext(TuiStateReaderContext);
  const controller = context?.controllers.getDependenciesController;

  return useTickingReadModel<GetDependenciesResponse>(
    useCallback(async () => {
      if (controller === undefined) {
        return null;
      }

      return controller.handle(filter === undefined ? {} : { filter });
    }, [controller, filter]),
    controller === undefined
      ? 0
      : context?.tickMs ?? DEFAULT_TUI_STATE_READER_TICK_MS,
  );
}
