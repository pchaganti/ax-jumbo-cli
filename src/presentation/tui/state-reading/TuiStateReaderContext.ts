import { createContext } from "react";
import type { TuiStateReaderControllers } from "./TuiStateReaderControllers.js";

interface TuiStateReaderContextValue {
  readonly controllers: TuiStateReaderControllers;
  readonly tickMs: number;
}

export const TuiStateReaderContext =
  createContext<TuiStateReaderContextValue | null>(null);
