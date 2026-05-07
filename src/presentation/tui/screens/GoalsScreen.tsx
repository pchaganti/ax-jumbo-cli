import React from "react";
import { Box, Text } from "ink";
import { TuiColors, TuiGlyphs } from "../../shared/DesignTokens.js";

export function GoalsScreen(): React.ReactElement {
  return (
    <Box flexDirection="column" paddingX={1}>
      <Text color={TuiColors.brand}>
        {TuiGlyphs.accentBar} Goals
      </Text>
      <Text color={TuiColors.muted}>
        Goal backlog and lifecycle management
      </Text>
    </Box>
  );
}
