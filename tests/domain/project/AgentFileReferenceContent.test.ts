/**
 * Tests for AgentFileReferenceContent value object
 */

import { AgentFileReferenceContent } from "../../../src/domain/project/AgentFileReferenceContent";

describe("AgentFileReferenceContent Value Object", () => {
  describe("getAgentFileReference()", () => {
    it("should return thin reference content parameterized by filename", () => {
      const reference = AgentFileReferenceContent.getAgentFileReference("CLAUDE.md");

      expect(reference).toContain("# CLAUDE.md");
      expect(reference).toContain("## Instructions for Agents on how to collaborate with Jumbo");
      expect(reference).toContain("See JUMBO.md and follow all instructions.");
      expect(reference).toContain("If the file does not exist, then ignore this instruction.");
    });

    it("should use the provided filename as the header", () => {
      const claudeRef = AgentFileReferenceContent.getAgentFileReference("CLAUDE.md");
      const geminiRef = AgentFileReferenceContent.getAgentFileReference("GEMINI.md");

      expect(claudeRef).toContain("# CLAUDE.md");
      expect(geminiRef).toContain("# GEMINI.md");
    });

    it("should not contain legacy verbose instructions", () => {
      const reference = AgentFileReferenceContent.getAgentFileReference("CLAUDE.md");

      expect(reference).not.toContain("CRITICAL STARTUP INSTRUCTION");
      expect(reference).not.toContain("!!!IMPORTANT!!!");
      expect(reference).not.toContain("AGENTS.md");
    });

    it("should end with a newline", () => {
      const reference = AgentFileReferenceContent.getAgentFileReference("CLAUDE.md");

      expect(reference.endsWith("\n")).toBe(true);
    });
  });

  describe("replaceAgentFileReference()", () => {
    it("should return null when legacy marker is not present", () => {
      const content = "# CLAUDE.md\n\nSome other content.";
      expect(AgentFileReferenceContent.replaceAgentFileReference(content, "CLAUDE.md")).toBeNull();
    });

    it("should replace entire file content when legacy marker is found", () => {
      const oldRef =
        "\nCRITICAL STARTUP INSTRUCTION: Old instructions.\n\nOld middle.\n\n!!!IMPORTANT!!! Old.\n";
      const content = `# CLAUDE.md\n${oldRef}`;

      const result = AgentFileReferenceContent.replaceAgentFileReference(content, "CLAUDE.md");

      expect(result).not.toBeNull();
      expect(result).toBe(AgentFileReferenceContent.getAgentFileReference("CLAUDE.md"));
    });

    it("should use the correct filename in the replacement", () => {
      const content = "CRITICAL STARTUP INSTRUCTION: Old.\n!!!IMPORTANT!!! Old.\n";

      const claudeResult = AgentFileReferenceContent.replaceAgentFileReference(content, "CLAUDE.md");
      const geminiResult = AgentFileReferenceContent.replaceAgentFileReference(content, "GEMINI.md");

      expect(claudeResult).toContain("# CLAUDE.md");
      expect(geminiResult).toContain("# GEMINI.md");
    });

    it("should not contain any legacy content in replacement", () => {
      const content = "# CLAUDE.md\n\nCRITICAL STARTUP INSTRUCTION: Old.\n!!!IMPORTANT!!! Old.\n";

      const result = AgentFileReferenceContent.replaceAgentFileReference(content, "CLAUDE.md");

      expect(result).not.toBeNull();
      expect(result).not.toContain("CRITICAL STARTUP INSTRUCTION");
      expect(result).not.toContain("!!!IMPORTANT!!!");
    });
  });
});
