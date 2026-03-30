export type AgentId = "claude" | "gemini" | "copilot" | "github-hooks" | "vibe" | "codex" | "cursor";

export interface AvailableAgent {
  readonly id: AgentId;
  readonly name: string;
}
