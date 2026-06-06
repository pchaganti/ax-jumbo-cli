import type { GoalStatusCountView } from "./GoalStatusCountView.js";

export interface GoalFlowStatsView {
  readonly byStatus: readonly GoalStatusCountView[];
  readonly activeBlockers: number;
  readonly refinedGoalsReady: number;
}
