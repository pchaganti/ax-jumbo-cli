import { ContextualGoalView } from "../get/ContextualGoalView.js";

/**
 * StartGoalResponse
 *
 * Response model for goal start requests.
 * Returns the enriched goal context view after successful start.
 */
export interface StartGoalResponse {
  readonly goalContextView: ContextualGoalView;
}
