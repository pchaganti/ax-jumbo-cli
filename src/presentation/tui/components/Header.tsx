import React from "react";
import { Box, Text, useInput } from "ink";
import { TuiColors, TuiGlyphs } from "../../shared/DesignTokens.js";
import { SCREEN_DEFINITIONS } from "../ScreenDefinitions.js";

interface HeaderProps {
  activeScreenIndex: number;
  onScreenChange: (index: number) => void;
  terminalWidth: number;
}

export function Header({
  activeScreenIndex,
  onScreenChange,
  terminalWidth,
}: HeaderProps): React.ReactElement {
  useInput((input, key) => {
    if (key.leftArrow) {
      const next = activeScreenIndex - 1;
      if (next >= 0) {
        onScreenChange(next);
      }
    } else if (key.rightArrow) {
      const next = activeScreenIndex + 1;
      if (next < SCREEN_DEFINITIONS.length) {
        onScreenChange(next);
      }
    } else {
      const num = parseInt(input, 10);
      if (num >= 1 && num <= SCREEN_DEFINITIONS.length) {
        onScreenChange(num - 1);
      }
    }
  });

  return (
    <Box flexDirection="column" width={terminalWidth}>
      <Box paddingX={1}>
        {SCREEN_DEFINITIONS.map((screen, index) => {
          const isActive = index === activeScreenIndex;
          return (
            <Box key={screen.key} marginRight={2}>
              <Text
                color={isActive ? TuiColors.brand : TuiColors.muted}
                bold={isActive}
              >
                {isActive ? TuiGlyphs.selector : " "} {screen.shortcut}{" "}
                {screen.label}
              </Text>
            </Box>
          );
        })}
      </Box>
      <Text color={TuiColors.muted} dimColor>
        {TuiGlyphs.divider.repeat(terminalWidth)}
      </Text>
    </Box>
  );
}
