/**
 * Command to commit a goal after refinement is complete.
 * Transitions goal status from "in-refinement" to "refined".
 */
export interface CommitGoalCommand {
  readonly goalId: string;
}
