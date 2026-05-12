import React from "react";
import { Box, Text } from "ink";
import { BaseColors, SemanticColors, TuiGlyphs } from "../../shared/DesignTokens.js";

export function SessionScreen(): React.ReactElement {
  return (
    <Box flexDirection="column" paddingX={1}>
      <Text color={BaseColors.brandBlue}>
        {TuiGlyphs.accentBar} Session
      </Text>
      <Text color={SemanticColors.muted}>
        Current session focus and history
      </Text>
    </Box>
  );
}
