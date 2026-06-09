export const CliVersionComparison = {
  Older: -1,
  Equal: 0,
  Newer: 1,
} as const;

export type CliVersionComparison =
  (typeof CliVersionComparison)[keyof typeof CliVersionComparison];
