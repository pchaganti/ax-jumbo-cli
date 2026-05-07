import React from "react";
import { Box, Text } from "ink";
import { TuiColors, TuiGlyphs } from "../../shared/DesignTokens.js";

export function MemoryScreen(): React.ReactElement {
  return (
    <Box flexDirection="column" paddingX={1}>
      <Text color={TuiColors.brand}>
        {TuiGlyphs.accentBar} Memory
      </Text>
      <Text color={TuiColors.muted}>
        Decisions, invariants, components, dependencies, guidelines
      </Text>
    </Box>
  );
}
