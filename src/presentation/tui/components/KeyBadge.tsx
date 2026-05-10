import React from "react";
import { Box, Text } from "ink";
import { TuiColors } from "../../shared/DesignTokens.js";

interface KeyBadgeProps {
  char: string;
  label?: string;
}

export function KeyBadge({ char, label }: KeyBadgeProps): React.ReactElement {
  return (
    <Box alignItems="center" gap={1}>
      <Text backgroundColor={TuiColors.keyBadgeBackground} color={TuiColors.keyBadge} bold>{` ${char} `}</Text>
      {label !== undefined && <Text color={TuiColors.muted}>{label}</Text>}
    </Box>
  );
}
