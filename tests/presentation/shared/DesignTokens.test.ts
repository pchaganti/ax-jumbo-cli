import { describe, expect, it } from "@jest/globals";
import { TuiColors, TuiSpacing, TuiGlyphs } from "../../../src/presentation/shared/DesignTokens.js";

describe("DesignTokens", () => {
  describe("TuiColors", () => {
    it("provides hex color values for all tokens", () => {
      const hexPattern = /^#[0-9a-f]{6}$/;
      for (const [key, value] of Object.entries(TuiColors)) {
        expect(value).toMatch(hexPattern);
      }
    });

    it("includes brand color", () => {
      expect(TuiColors.brand).toBe("#66b4f4");
    });

    it("includes status colors", () => {
      expect(TuiColors.success).toBeDefined();
      expect(TuiColors.error).toBeDefined();
      expect(TuiColors.warning).toBeDefined();
      expect(TuiColors.info).toBeDefined();
    });
  });

  describe("TuiSpacing", () => {
    it("defines header and footer heights", () => {
      expect(TuiSpacing.headerHeight).toBe(1);
      expect(TuiSpacing.footerHeight).toBe(1);
    });

    it("defines padding scale", () => {
      expect(TuiSpacing.padding.small).toBeLessThan(TuiSpacing.padding.medium);
      expect(TuiSpacing.padding.medium).toBeLessThan(TuiSpacing.padding.large);
    });
  });

  describe("TuiGlyphs", () => {
    it("provides all expected glyph characters", () => {
      expect(TuiGlyphs.accentBar).toBe("│");
      expect(TuiGlyphs.bullet).toBe("•");
      expect(TuiGlyphs.arrow).toBe("→");
      expect(TuiGlyphs.selector).toBe("▸");
      expect(TuiGlyphs.divider).toBe("─");
    });
  });
});
