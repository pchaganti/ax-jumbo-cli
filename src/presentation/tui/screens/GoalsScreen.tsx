import React from "react";
import { Box, Text } from "ink";
import { BaseColors, SemanticColors, TuiGlyphs } from "../../shared/DesignTokens.js";

export function GoalsScreen(): React.ReactElement {
  return (
    <Box flexDirection="column" paddingX={1}>
      <Text color={BaseColors.brandBlue}>
        {TuiGlyphs.accentBar} Goals
      </Text>
      <Text color={SemanticColors.muted}>
        Goal backlog and lifecycle management
      </Text>
    </Box>
  );
}
