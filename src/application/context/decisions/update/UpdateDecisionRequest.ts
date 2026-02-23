export interface UpdateDecisionRequest {
  readonly decisionId: string;
  readonly title?: string;
  readonly context?: string;
  readonly rationale?: string;
  readonly alternatives?: string[];
  readonly consequences?: string;
}
