export const TuiDaemonEventStatus = {
  STARTING: "starting",
  STOPPING: "stopping",
  STOPPED: "stopped",
  FAILED: "failed",
  IDLE: "idle",
  PROCESSING: "processing",
  COMPLETED: "completed",
  SKIPPED: "skipped",
  EXHAUSTED: "exhausted",
  CODIFYING: "codifying",
} as const;

export type TuiDaemonEventStatusValue =
  (typeof TuiDaemonEventStatus)[keyof typeof TuiDaemonEventStatus];
