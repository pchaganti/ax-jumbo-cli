import type {
  TuiDaemonEventStatusValue,
} from "./TuiDaemonEventStatus.js";

export interface TuiDaemonEventSnapshot {
  readonly daemon: string;
  readonly status: TuiDaemonEventStatusValue | (string & {});
  readonly source?: string;
  readonly category?: string;
  readonly message?: string;
  readonly timestampMs?: number;
  readonly goalId?: string;
  readonly attempt?: number;
  readonly maxRetries?: number;
  readonly exitCode?: number;
  readonly errorMessage?: string;
}
