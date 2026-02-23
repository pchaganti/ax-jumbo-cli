import { ContextualGoalView } from "../get/ContextualGoalView.js";

/**
 * UpdateGoalProgressResponse
 *
 * Response model for goal progress update requests.
 * Returns the enriched goal context view after successful progress update.
 */
export interface UpdateGoalProgressResponse {
  readonly goalContextView: ContextualGoalView;
}
