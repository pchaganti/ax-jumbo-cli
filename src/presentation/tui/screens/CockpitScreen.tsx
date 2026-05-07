import React from "react";
import { Box, Text } from "ink";
import { TuiColors, TuiGlyphs } from "../../shared/DesignTokens.js";

export function CockpitScreen(): React.ReactElement {
  return (
    <Box flexDirection="column" paddingX={1}>
      <Text color={TuiColors.brand}>
        {TuiGlyphs.accentBar} Cockpit
      </Text>
      <Text color={TuiColors.muted}>
        Project orientation and goal overview
      </Text>
    </Box>
  );
}
