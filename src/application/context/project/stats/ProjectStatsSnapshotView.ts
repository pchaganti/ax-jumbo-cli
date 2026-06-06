import type { ContextCoverageStatsView } from "./ContextCoverageStatsView.js";
import type { GoalFlowStatsView } from "./GoalFlowStatsView.js";
import type { MemoryTypeCountView } from "./MemoryTypeCountView.js";

export interface ProjectStatsSnapshotView {
  readonly memoryCounts: MemoryTypeCountView;
  readonly goalFlow: GoalFlowStatsView;
  readonly contextCoverage: ContextCoverageStatsView;
}
