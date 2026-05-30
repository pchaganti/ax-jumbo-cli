import type { TuiDaemonConfig } from "./TuiDaemonConfig.js";
import type { TuiDaemonName } from "./TuiDaemonName.js";
import type { TuiSubprocessSnapshot } from "./TuiSubprocessSnapshot.js";

export type { TuiDaemonConfig, TuiDaemonConfigs } from "./TuiDaemonConfig.js";
export type { TuiDaemonEventSnapshot } from "./TuiDaemonEventSnapshot.js";
export type { TuiDaemonEventStatusValue as TuiDaemonEventStatus } from "./TuiDaemonEventStatus.js";
export type { TuiDaemonName } from "./TuiDaemonName.js";
export type { TuiDaemonCounts } from "./TuiDaemonCounts.js";
export type { TuiSubprocessSnapshot } from "./TuiSubprocessSnapshot.js";
export type { TuiSubprocessStatusValue as TuiSubprocessStatus } from "./TuiSubprocessStatus.js";

export interface ISubprocessManager {
  spawn(name: TuiDaemonName, config?: Partial<TuiDaemonConfig>): Promise<TuiSubprocessSnapshot>;
  terminate(name: TuiDaemonName): Promise<TuiSubprocessSnapshot>;
  terminateAll(): Promise<void>;
  getStatus(name: TuiDaemonName): TuiSubprocessSnapshot;
  getAllStatuses(): readonly TuiSubprocessSnapshot[];
}
