import React from "react";
import { Box, Text } from "ink";
import { BaseColors, SemanticColors, TuiGlyphs } from "../../shared/DesignTokens.js";

interface ScreenTitleCardProps {
  title: string;
  subtitle: string;
}

export function ScreenTitleCard({
  title,
  subtitle,
}: ScreenTitleCardProps): React.ReactElement {
  return (
    <Box flexDirection="column" paddingX={1}>
      <Text color={BaseColors.brandBlue}>
        {TuiGlyphs.accentBar} {title}
      </Text>
      <Text color={SemanticColors.muted}>{subtitle}</Text>
    </Box>
  );
}
