import React from "react";
import { Box, Text } from "ink";
import { BaseColors, SemanticColors } from "../../shared/DesignTokens.js";

interface SectionHeadingProps {
  title: string;
  dimmed?: boolean;
}

export function SectionHeading({
  title,
  dimmed,
}: SectionHeadingProps): React.ReactElement {
  return (
    <Box marginTop={1} marginBottom={0}>
      <Text color={dimmed ? BaseColors.brandBlue50 : SemanticColors.headline} bold>
        | {title}
      </Text>
    </Box>
  );
}
