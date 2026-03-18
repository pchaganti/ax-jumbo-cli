/**
 * Domain Value Object: Agent File Reference Content
 *
 * Codifies the thin reference content for CLAUDE.md and GEMINI.md
 * that directs agents to read JUMBO.md on startup.
 * Handles content generation and legacy content replacement.
 *
 * Rationale: Codified in domain rather than template file to support
 * npm distribution (no file copying during build).
 */

export class AgentFileReferenceContent {
  /**
   * Generate thin reference content for agent files (CLAUDE.md, GEMINI.md)
   * parameterized by filename.
   */
  static getAgentFileReference(fileName: string): string {
    return `# ${fileName}

## Instructions for Agents on how to collaborate with Jumbo

See JUMBO.md and follow all instructions. If the file does not exist, then ignore this instruction.
`;
  }

  /**
   * Replace legacy agent file reference content with the new thin reference.
   * Detects the legacy "CRITICAL STARTUP INSTRUCTION:" marker and replaces
   * the entire file content with the new reference.
   *
   * @returns Updated content, or null if legacy marker not found
   */
  static replaceAgentFileReference(existingContent: string, fileName: string): string | null {
    const legacyMarker = "CRITICAL STARTUP INSTRUCTION:";

    if (existingContent.indexOf(legacyMarker) === -1) return null;

    return this.getAgentFileReference(fileName);
  }
}
