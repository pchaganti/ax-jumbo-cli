import React from "react";
import { Box, Text } from "ink";
import { SemanticColors, TuiLayout } from "../../shared/DesignTokens.js";
import { KeyBadge } from "../components/KeyBadge.js";

export function CockpitGreeterView(): React.ReactElement {
  return (
    <Box flexDirection="column" paddingX={2} paddingY={1} width={TuiLayout.bannerWidth}>
      <Box flexDirection="row">
        <Box flexBasis="3%" />
        <Box flexDirection="column" flexBasis="94%">
          <Box marginTop={1}>
            <Text color={SemanticColors.primary} wrap="wrap">
              Hi, I'm Jumbo. I give your coding agents the memory they're missing
              and help you manage the context you provide to them when completing
              tasks. So you can focus on what your building and not have to repeat
              yourself to them all the time.
            </Text>
          </Box>

          <Box marginTop={2} flexDirection="column" alignItems="center">
            <Box alignItems="center" gap={1}>
              <Text color={SemanticColors.primary}>Press </Text>
              <KeyBadge char="i" />
              <Text color={SemanticColors.primary}> to initialize</Text>
            </Box>
            <Box marginTop={1}>
              <Text color={SemanticColors.muted}>
                or run 'jumbo init' from another terminal
              </Text>
            </Box>
          </Box>
        </Box>
        <Box flexBasis="3%" />
      </Box>
    </Box>
  );
}
