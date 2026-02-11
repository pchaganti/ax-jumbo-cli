/**
 * JSON output structure for hook integration.
 * Must match Gemini CLI hook specification.
 */
export interface HookOutput {
  decision: 'allow' | 'deny' | 'modify';
  promptSections: Array<{
    type: string;
    content: unknown;
    annotation?: string;
  }>;
  systemMessage?: string;
}
