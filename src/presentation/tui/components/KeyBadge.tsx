import React from "react";
import { Box, Text } from "ink";
import { SemanticColors } from "../../shared/DesignTokens.js";

interface KeyBadgeProps {
  char: string;
  label?: string;
}

export function KeyBadge({ char, label }: KeyBadgeProps): React.ReactElement {
  return (
    <Box alignItems="center" gap={1}>
      <Text backgroundColor={SemanticColors.keyBadgeBackground} color={SemanticColors.keyBadge} bold>{` ${char} `}</Text>
      {label !== undefined && <Text color={SemanticColors.muted}>{label}</Text>}
    </Box>
  );
}
