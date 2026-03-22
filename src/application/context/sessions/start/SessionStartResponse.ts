import { EnrichedSessionContext } from "../get/EnrichedSessionContext.js";
import { ActivityMirror } from "./ActivityMirrorAssembler.js";

/**
 * SessionStartResponse - Result of starting a new session.
 *
 * Contains the enriched session context (with LLM instruction signals),
 * the newly created session ID, and an optional activity mirror summary.
 */
export interface SessionStartResponse {
  readonly context: EnrichedSessionContext;
  readonly sessionId: string;
  readonly activityMirror: ActivityMirror | null;
}
