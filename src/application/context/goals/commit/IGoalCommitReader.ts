import { GoalView } from "../GoalView.js";

/**
 * Port interface for reading goal projections.
 * Used by CommitGoalCommandHandler to check goal existence.
 */
export interface IGoalCommitReader {
  findById(goalId: string): Promise<GoalView | null>;
}
