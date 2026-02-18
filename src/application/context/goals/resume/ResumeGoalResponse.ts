import { ContextualGoalView } from "../get/ContextualGoalView.js";

/**
 * ResumeGoalResponse
 *
 * Response model for goal resume requests.
 * Returns the full contextual goal view after successful resume.
 */
export interface ResumeGoalResponse {
  readonly contextualGoalView: ContextualGoalView;
}
