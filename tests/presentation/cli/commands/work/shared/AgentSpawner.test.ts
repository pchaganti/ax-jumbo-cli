import { describe, it, expect } from "@jest/globals";
import {
  SUPPORTED_AGENTS,
  AGENT_COMMANDS,
} from "../../../../../../src/presentation/cli/commands/work/shared/AgentSpawner.js";

describe("AgentSpawner", () => {
  describe("SUPPORTED_AGENTS", () => {
    it("includes all expected agent identifiers", () => {
      expect(SUPPORTED_AGENTS).toContain("claude");
      expect(SUPPORTED_AGENTS).toContain("gemini");
      expect(SUPPORTED_AGENTS).toContain("copilot");
      expect(SUPPORTED_AGENTS).toContain("codex");
      expect(SUPPORTED_AGENTS).toContain("cursor");
      expect(SUPPORTED_AGENTS).toContain("vibe");
      expect(SUPPORTED_AGENTS).toHaveLength(6);
    });
  });

  describe("AGENT_COMMANDS", () => {
    it("maps each agent to an executable and prompt flag", () => {
      for (const agentId of SUPPORTED_AGENTS) {
        const entry = AGENT_COMMANDS[agentId];
        expect(entry).toBeDefined();
        expect(typeof entry.executable).toBe("string");
        expect(typeof entry.promptFlag).toBe("string");
      }
    });

    it("uses -p as prompt flag for all agents", () => {
      for (const agentId of SUPPORTED_AGENTS) {
        expect(AGENT_COMMANDS[agentId].promptFlag).toBe("-p");
      }
    });

    it("maps copilot to gh copilot executable", () => {
      expect(AGENT_COMMANDS.copilot.executable).toBe("gh copilot");
    });

    it("maps claude to claude executable", () => {
      expect(AGENT_COMMANDS.claude.executable).toBe("claude");
    });

    it("maps gemini to gemini executable", () => {
      expect(AGENT_COMMANDS.gemini.executable).toBe("gemini");
    });
  });
});
