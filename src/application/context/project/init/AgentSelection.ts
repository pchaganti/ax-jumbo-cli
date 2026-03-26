export type AgentId = "claude" | "gemini" | "copilot" | "github-hooks";

export interface AvailableAgent {
  readonly id: AgentId;
  readonly name: string;
}
