import { GoalView } from "./GoalView.js";

/**
 * Port interface for reading goals by title.
 * Used for deduplication when registering goals programmatically.
 */
export interface IGoalTitleReader {
  findByTitle(title: string): Promise<GoalView | null>;
}
