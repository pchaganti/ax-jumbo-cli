import React from "react";
import { Box, Text } from "ink";
import { TuiColors, TuiGlyphs } from "../../shared/DesignTokens.js";

export function SessionScreen(): React.ReactElement {
  return (
    <Box flexDirection="column" paddingX={1}>
      <Text color={TuiColors.brand}>
        {TuiGlyphs.accentBar} Session
      </Text>
      <Text color={TuiColors.muted}>
        Current session focus and history
      </Text>
    </Box>
  );
}
