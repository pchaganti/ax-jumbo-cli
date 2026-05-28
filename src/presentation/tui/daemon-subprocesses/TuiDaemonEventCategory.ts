import { TuiDaemonEventStatus } from "./TuiDaemonEventStatus.js";

export const TuiDaemonEventCategory = {
  MODEL_OUTPUT: "model-output",
  STOPPING: TuiDaemonEventStatus.STOPPING,
  STOPPED: TuiDaemonEventStatus.STOPPED,
  FAILED: TuiDaemonEventStatus.FAILED,
} as const;
