import React, { useMemo } from "react";
import type { TuiStateReaderControllers } from "./TuiStateReaderControllers.js";
import { TuiStateReaderContext } from "./TuiStateReaderContext.js";
import { DEFAULT_TUI_STATE_READER_TICK_MS } from "./TuiStateReaderDefaults.js";
import type { TuiStateReaderOptions } from "./TuiStateReaderOptions.js";

interface TuiStateReaderProviderProps {
  readonly controllers?: TuiStateReaderControllers;
  readonly options?: TuiStateReaderOptions;
  readonly children: React.ReactNode;
}

export function TuiStateReaderProvider({
  controllers = {},
  options = {},
  children,
}: TuiStateReaderProviderProps): React.ReactElement {
  const tickMs = options.tickMs ?? DEFAULT_TUI_STATE_READER_TICK_MS;
  const value = useMemo(
    () => ({
      controllers,
      tickMs,
    }),
    [controllers, tickMs],
  );

  return (
    <TuiStateReaderContext.Provider value={value}>
      {children}
    </TuiStateReaderContext.Provider>
  );
}
