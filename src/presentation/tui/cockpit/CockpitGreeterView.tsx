import React from "react";
import { Box, Text } from "ink";
import { BaseColors, SemanticColors, TuiLayout } from "../../shared/DesignTokens.js";
import { CenteredPrompt } from "./CenteredPrompt.js";

export function CockpitGreeterView(): React.ReactElement {
  return (
    <Box flexDirection="column" flexGrow={1} width="100%" paddingY={1} alignItems="center">
      <Box flexDirection="column" width={TuiLayout.bannerWidth} paddingX={2}>
        <Box flexDirection="row">
          <Box flexBasis="3%" />
          <Box flexDirection="column" flexBasis="94%">
            <Box marginTop={1}>
              <Text color={BaseColors.brandBlue} wrap="wrap">
                Hi, I'm Jumbo. I give your coding agents the memory they're missing
                and help you manage the context you provide to them when completing
                tasks. So you can focus on what your building and not have to repeat
                yourself to them all the time.
              </Text>
            </Box>

            <Box marginTop={2}>
              <CenteredPrompt
                keyChar="i"
                prefix="Press "
                suffix=" to initialize"
                secondary="or run 'jumbo init' from another terminal"
              />
            </Box>
          </Box>
          <Box flexBasis="3%" />
        </Box>
      </Box>
    </Box>
  );
}
