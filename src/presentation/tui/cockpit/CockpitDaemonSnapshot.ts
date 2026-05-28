import type {
  TuiDaemonEventStatusValue,
} from "../daemon-subprocesses/TuiDaemonEventStatus.js";
import type {
  TuiSubprocessStatusValue,
} from "../daemon-subprocesses/TuiSubprocessStatus.js";

export interface CockpitDaemonSnapshot {
  readonly status: TuiSubprocessStatusValue;
  readonly events: readonly CockpitDaemonEventSnapshot[];
}

export interface CockpitDaemonEventSnapshot {
  readonly status: TuiDaemonEventStatusValue | (string & {});
}
