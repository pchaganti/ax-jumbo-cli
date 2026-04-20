/**
 * Agent Spawner
 *
 * Encapsulates supported agent CLI tools, their command mappings,
 * and the subprocess spawning logic used by work daemons.
 */

import { spawn } from "node:child_process";

export const SUPPORTED_AGENTS = ["claude", "gemini", "copilot", "codex", "cursor", "vibe"] as const;
export type AgentId = typeof SUPPORTED_AGENTS[number];

export const AGENT_COMMANDS: Record<AgentId, { executable: string; promptFlag: string }> = {
  claude:  { executable: "claude",     promptFlag: "-p" },
  gemini:  { executable: "gemini",     promptFlag: "-p" },
  copilot: { executable: "gh copilot", promptFlag: "-p" },
  codex:   { executable: "codex",      promptFlag: "-p" },
  cursor:  { executable: "cursor",     promptFlag: "-p" },
  vibe:    { executable: "vibe",       promptFlag: "-p" },
};

/**
 * Spawn an agent CLI subprocess with the given prompt.
 * Returns the exit code (0 = success, non-zero = failure).
 */
export function spawnAgent(agentId: AgentId, prompt: string): Promise<number> {
  const { executable, promptFlag } = AGENT_COMMANDS[agentId];
  const escaped = prompt.replace(/"/g, '\\"');
  const command = `${executable} ${promptFlag} "${escaped}"`;

  return new Promise((resolve) => {
    const child = spawn(command, [], {
      stdio: ["ignore", "ignore", "ignore"],
      shell: true,
    });

    child.on("close", (code) => resolve(code ?? 1));
    child.on("error", () => resolve(1));
  });
}
