import { EnrichedSessionContext } from "../../sessions/get/EnrichedSessionContext.js";

/**
 * ResumeWorkResponse - Result of resuming work.
 *
 * Contains the resumed goal's identity and enriched session context
 * with resume-specific LLM instruction signals.
 */
export interface ResumeWorkResponse {
  readonly goalId: string;
  readonly objective: string;
  readonly context: EnrichedSessionContext;
}
