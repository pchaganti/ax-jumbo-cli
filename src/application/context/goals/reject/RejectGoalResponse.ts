/**
 * RejectGoalResponse
 *
 * Response model for goal rejection requests.
 * Returns goal data and audit findings after successful rejection.
 */
export interface RejectGoalResponse {
  readonly goalId: string;
  readonly status: string;
  readonly objective: string;
  readonly auditFindings: string;
  readonly nextGoalId?: string;
}
