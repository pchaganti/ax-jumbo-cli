/**
 * Tests for CopilotInstructionsContent value object
 */

import { CopilotInstructionsContent } from "../../../src/domain/project/CopilotInstructionsContent";

describe("CopilotInstructionsContent Value Object", () => {
  describe("getCopilotInstructions()", () => {
    it("should return thin reference content for copilot-instructions.md", () => {
      const content = CopilotInstructionsContent.getCopilotInstructions();

      expect(content).toContain("# copilot-instructions.md");
      expect(content).toContain("## Instructions for Agents on how to collaborate with Jumbo");
      expect(content).toContain("See ../JUMBO.md and follow all instructions.");
      expect(content).toContain("If the file does not exist, then ignore this instruction.");
    });

    it("should not contain legacy verbose instructions", () => {
      const content = CopilotInstructionsContent.getCopilotInstructions();

      expect(content).not.toContain("## Jumbo Context Management");
      expect(content).not.toContain("MANDATORY FIRST ACTION");
      expect(content).not.toContain("jumbo session start");
    });

    it("should reference ../JUMBO.md (relative path for .github subdirectory)", () => {
      const content = CopilotInstructionsContent.getCopilotInstructions();

      expect(content).toContain("../JUMBO.md");
    });
  });

  describe("getCopilotSectionMarker()", () => {
    it("should match the heading in getCopilotInstructions()", () => {
      const marker = CopilotInstructionsContent.getCopilotSectionMarker();
      const content = CopilotInstructionsContent.getCopilotInstructions();

      expect(content).toContain(marker);
    });

    it("should be the new standard marker", () => {
      const marker = CopilotInstructionsContent.getCopilotSectionMarker();

      expect(marker).toBe("## Instructions for Agents on how to collaborate with Jumbo");
    });
  });

  describe("replaceCopilotSection()", () => {
    it("should return null when no marker is present", () => {
      const content = "# Copilot Instructions\n\nSome other content.";
      expect(CopilotInstructionsContent.replaceCopilotSection(content)).toBeNull();
    });

    it("should replace section with current marker", () => {
      const currentMarker = CopilotInstructionsContent.getCopilotSectionMarker();
      const content = `# Copilot\n\n${currentMarker}\n\nOld content.\n`;

      const result = CopilotInstructionsContent.replaceCopilotSection(content);

      expect(result).not.toBeNull();
      expect(result).toContain("See ../JUMBO.md and follow all instructions.");
      expect(result).not.toContain("Old content.");
    });

    it("should replace section with legacy Jumbo Context Management marker", () => {
      const content = "# Copilot\n\n## Jumbo Context Management\n\nOld copilot content.\n";

      const result = CopilotInstructionsContent.replaceCopilotSection(content);

      expect(result).not.toBeNull();
      expect(result).toContain("## Instructions for Agents on how to collaborate with Jumbo");
      expect(result).toContain("See ../JUMBO.md and follow all instructions.");
      expect(result).not.toContain("Old copilot content.");
      expect(result).not.toContain("## Jumbo Context Management");
    });

    it("should preserve content before the section", () => {
      const before = "# Copilot Instructions\n\nCustom intro.\n\n";
      const content = `${before}## Jumbo Context Management\n\nOld.\n`;

      const result = CopilotInstructionsContent.replaceCopilotSection(content);

      expect(result).not.toBeNull();
      expect(result!.startsWith(before)).toBe(true);
    });

    it("should preserve content after the section when next heading exists", () => {
      const content =
        "# Copilot\n\n## Jumbo Context Management\n\nOld.\n\n## Other Section\n\nKeep this.";

      const result = CopilotInstructionsContent.replaceCopilotSection(content);

      expect(result).not.toBeNull();
      expect(result).toContain("## Other Section");
      expect(result).toContain("Keep this.");
    });

    it("should handle section at EOF", () => {
      const content = "# Copilot\n\n## Jumbo Context Management\n\nOld content at EOF.";

      const result = CopilotInstructionsContent.replaceCopilotSection(content);

      expect(result).not.toBeNull();
      expect(result).toContain("See ../JUMBO.md and follow all instructions.");
    });
  });
});
