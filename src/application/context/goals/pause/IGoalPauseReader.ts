import { GoalView } from "../GoalView.js";

/**
 * Port interface for reading goal projections.
 * Used by LocalPauseGoalGateway to fetch updated goal view after pause.
 */
export interface IGoalPauseReader {
  findById(goalId: string): Promise<GoalView | null>;
}
