export const TuiSubprocessStatus = {
  STOPPED: "stopped",
  RUNNING: "running",
  FAILED: "failed",
} as const;

export type TuiSubprocessStatusValue =
  (typeof TuiSubprocessStatus)[keyof typeof TuiSubprocessStatus];
