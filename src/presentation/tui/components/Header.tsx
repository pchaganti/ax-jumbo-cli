import React from "react";
import { Box, Text } from "ink";
import { BaseColors, SemanticColors, TuiGlyphs } from "../../shared/DesignTokens.js";

interface HeaderProps {
  projectName: string;
  version: string;
  terminalWidth: number;
}

export function Header({
  projectName,
  version,
  terminalWidth,
}: HeaderProps): React.ReactElement {
  return (
    <Box flexDirection="column" width={terminalWidth}>
      <Box justifyContent="space-between" paddingX={1}>
        <Text color={BaseColors.brandBlue} bold>
          {projectName}
        </Text>
        <Text color={SemanticColors.muted}>v{version}</Text>
      </Box>
      <Text color={SemanticColors.muted} dimColor>
        {TuiGlyphs.divider.repeat(terminalWidth)}
      </Text>
    </Box>
  );
}
