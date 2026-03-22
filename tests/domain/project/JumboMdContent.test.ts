/**
 * Tests for JumboMdContent value object
 */

import { JumboMdContent } from "../../../src/domain/project/JumboMdContent";

describe("JumboMdContent Value Object", () => {
  describe("getJumboSection()", () => {
    it("should return Jumbo section markdown content", () => {
      const content = JumboMdContent.getJumboSection();

      expect(content).toContain("## Instructions for Agents on how to collaborate with Jumbo");
      expect(content).toContain("Jumbo CLI for agent orchestration and context management");
      expect(content).toContain("jumbo session start");
      expect(content).toContain("jumbo goal start");
      expect(content).toContain("jumbo component add");
      expect(content).toContain("jumbo decision add");
      expect(content).toContain("jumbo guideline add");
      expect(content).toContain("jumbo invariant add");
    });

    it("should include available commands section with jumbo goal refine", () => {
      const content = JumboMdContent.getJumboSection();

      expect(content).toContain("### Available Commands");
      expect(content).toContain("jumbo goal add --help");
      expect(content).toContain("jumbo goal refine --help");
      expect(content).toContain("jumbo session start --help");
    });

    it("should include context maintenance section with specific behavioral expectations", () => {
      const content = JumboMdContent.getJumboSection();

      expect(content).toContain("### Maintain Context as You Work");
      expect(content).toContain("#### During Refinement");
      expect(content).toContain("jumbo goal add --objective");
      expect(content).toContain("--prerequisite-goals");
      expect(content).toContain("#### During Implementation");
      expect(content).toContain("jumbo decision add --title");
      expect(content).toContain("jumbo component add --name");
      expect(content).toContain("jumbo relation add --from-type goal");
      expect(content).toContain("#### When the User Corrects You");
      expect(content).toContain("jumbo invariant add --category");
      expect(content).toContain("jumbo guideline add --category");
      expect(content).toContain("#### Why This Matters");
    });

    it("should include Dear Agent letter", () => {
      const content = JumboMdContent.getJumboSection();

      expect(content).toContain("Dear Agent,");
      expect(content).toContain("Sincerely,");
      expect(content).toContain("Project Administrator");
    });

    it("should include session lifecycle sections", () => {
      const content = JumboMdContent.getJumboSection();

      expect(content).toContain("### When you start a new Session Start");
      expect(content).toContain("### Pre Compaction/Compression");
      expect(content).toContain("### After Compaction/Compression");
      expect(content).toContain("### Before Finishing a Session");
      expect(content).toContain("### Before Starting Work on a Goal");
    });

    it("should include next step", () => {
      const content = JumboMdContent.getJumboSection();

      expect(content).toContain("### Next step:");
      expect(content).toContain("Run `jumbo session start` to retrieve project orientation.");
    });
  });

  describe("getFullContent()", () => {
    it("should return complete JUMBO.md content with header", () => {
      const content = JumboMdContent.getFullContent();

      expect(content).toContain("# JUMBO.md");
      expect(content).toContain("## Instructions for Agents on how to collaborate with Jumbo");
    });

    it("should include Jumbo section in full content", () => {
      const fullContent = JumboMdContent.getFullContent();
      const jumboSection = JumboMdContent.getJumboSection();

      expect(fullContent).toContain(jumboSection);
    });
  });

  describe("getCurrentSectionMarker()", () => {
    it("should match the heading in getJumboSection()", () => {
      const marker = JumboMdContent.getCurrentSectionMarker();
      const section = JumboMdContent.getJumboSection();

      expect(section).toContain(marker);
    });
  });

  describe("getLegacySectionMarkers()", () => {
    it("should return an array of all historically used section headings", () => {
      const markers = JumboMdContent.getLegacySectionMarkers();

      expect(markers).toContain("## Instructions for Jumbo");
    });

    it("should not include the current marker", () => {
      const legacyMarkers = JumboMdContent.getLegacySectionMarkers();
      const currentMarker = JumboMdContent.getCurrentSectionMarker();

      expect(legacyMarkers).not.toContain(currentMarker);
    });
  });

  describe("replaceJumboSection()", () => {
    it("should return null when no marker is present", () => {
      const content = "# My JUMBO.md\n\nSome other content.";
      expect(JumboMdContent.replaceJumboSection(content)).toBeNull();
    });

    it("should replace section when current marker is present", () => {
      const currentMarker = JumboMdContent.getCurrentSectionMarker();
      const content = `# JUMBO.md\n\n${currentMarker}\n\nOld content here.\n`;

      const result = JumboMdContent.replaceJumboSection(content);

      expect(result).not.toBeNull();
      expect(result).toContain(JumboMdContent.getJumboSection());
      expect(result).not.toContain("Old content here.");
    });

    it("should replace section when a legacy marker is present", () => {
      const legacyMarker = JumboMdContent.getLegacySectionMarkers()[0];
      const content = `# JUMBO.md\n\n${legacyMarker}\n\nLegacy content here.\n`;

      const result = JumboMdContent.replaceJumboSection(content);

      expect(result).not.toBeNull();
      expect(result).toContain(JumboMdContent.getJumboSection());
      expect(result).not.toContain("Legacy content here.");
      expect(result).not.toContain(legacyMarker);
    });

    it("should preserve content before the section", () => {
      const before = "# JUMBO.md\n\nCustom intro.\n\n";
      const currentMarker = JumboMdContent.getCurrentSectionMarker();
      const content = `${before}${currentMarker}\n\nOld content.\n`;

      const result = JumboMdContent.replaceJumboSection(content);

      expect(result).not.toBeNull();
      expect(result!.startsWith(before)).toBe(true);
    });

    it("should preserve content after the section when next heading exists", () => {
      const currentMarker = JumboMdContent.getCurrentSectionMarker();
      const content = `# JUMBO.md\n\n${currentMarker}\n\nOld.\n\n## Other Section\n\nKeep this.`;

      const result = JumboMdContent.replaceJumboSection(content);

      expect(result).not.toBeNull();
      expect(result).toContain("## Other Section");
      expect(result).toContain("Keep this.");
    });

    it("should handle section at EOF", () => {
      const currentMarker = JumboMdContent.getCurrentSectionMarker();
      const content = `# JUMBO.md\n\n${currentMarker}\n\nOld content at EOF.`;

      const result = JumboMdContent.replaceJumboSection(content);

      expect(result).not.toBeNull();
      expect(result).toContain(JumboMdContent.getJumboSection());
    });
  });
});
