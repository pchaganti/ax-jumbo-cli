/**
 * Domain Value Object: AGENTS.md Content
 *
 * Codifies the thin reference content for AGENTS.md files that
 * points agents to JUMBO.md as the single source of truth.
 * Handles content generation, section marker management, and
 * section replacement for both current and legacy markers.
 *
 * Rationale: Codified in domain rather than template file to support
 * npm distribution (no file copying during build).
 */

export class AgentsMdContent {
  /**
   * Generate the Jumbo reference section for AGENTS.md
   */
  static getJumboSection(): string {
    return `## Instructions for Agents on how to collaborate with Jumbo

See JUMBO.md and follow all instructions. If the file does not exist, then ignore this instruction.
`;
  }

  /**
   * Generate complete AGENTS.md file content
   */
  static getFullContent(): string {
    return `# AGENTS.md

${this.getJumboSection()}`;
  }

  /**
   * The current section heading extracted from getJumboSection().
   */
  static getCurrentJumboSectionMarker(): string {
    return "## Instructions for Agents on how to collaborate with Jumbo";
  }

  /**
   * All historically used section headings for the Jumbo section in AGENTS.md.
   * When the current heading changes, add the previous heading here
   * so that repair/init can find and replace old installations.
   */
  static getLegacyJumboSectionMarkers(): string[] {
    return [
      "## Instructions for Jumbo",
    ];
  }

  /**
   * Replace the Jumbo section in AGENTS.md with the current thin reference version.
   * Checks the current marker and all legacy markers to find the section,
   * then replaces everything from the matched marker to the next "## " heading
   * (or EOF) with current getJumboSection().
   *
   * @returns Updated content, or null if no marker found
   */
  static replaceJumboSection(existingContent: string): string | null {
    const allMarkers = [this.getCurrentJumboSectionMarker(), ...this.getLegacyJumboSectionMarkers()];

    let matchedMarker: string | null = null;
    let markerIndex = -1;

    for (const marker of allMarkers) {
      const index = existingContent.indexOf(marker);
      if (index !== -1) {
        matchedMarker = marker;
        markerIndex = index;
        break;
      }
    }

    if (matchedMarker === null || markerIndex === -1) return null;

    // Find the next ## heading after the marker (or EOF)
    const afterMarker = existingContent.substring(markerIndex + matchedMarker.length);
    const nextHeadingMatch = afterMarker.match(/\n## /);
    const endIndex = nextHeadingMatch
      ? markerIndex + matchedMarker.length + nextHeadingMatch.index!
      : existingContent.length;

    const before = existingContent.substring(0, markerIndex);
    const after = existingContent.substring(endIndex);

    return before + this.getJumboSection() + after;
  }
}
