import React from "react";
import { Box, Text, useInput } from "ink";
import { SemanticColors, BaseColors, TuiGlyphs } from "../../shared/DesignTokens.js";

interface WizardTextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  focused?: boolean;
  error?: string;
}

export function WizardTextInput({
  label,
  value,
  onChange,
  placeholder,
  focused = true,
  error,
}: WizardTextInputProps): React.ReactElement {
  useInput(
    (input, key) => {
      if (key.backspace || key.delete) {
        if (value.length > 0) {
          onChange(value.slice(0, -1));
        }
        return;
      }

      if (
        key.return ||
        key.tab ||
        key.escape ||
        key.upArrow ||
        key.downArrow ||
        key.leftArrow ||
        key.rightArrow
      ) {
        return;
      }

      if (input && !key.ctrl && !key.meta) {
        onChange(value + input);
      }
    },
    { isActive: focused },
  );

  const showPlaceholder = value.length === 0 && placeholder !== undefined;

  return (
    <Box flexDirection="column" gap={0}>
      <Text
        color={focused ? SemanticColors.label : BaseColors.shade2}
        bold={focused}
      >
        {label}
      </Text>
      <Box marginLeft={2}>
        <Text color={SemanticColors.headline}>{"> "}</Text>
        {showPlaceholder ? (
          <Text color={BaseColors.shade4}>{placeholder}</Text>
        ) : (
          <Text color={SemanticColors.primary}>{value}</Text>
        )}
        {focused && <Text color={SemanticColors.headline}>▎</Text>}
      </Box>
      {error !== undefined && (
        <Box marginLeft={2}>
          <Text color={SemanticColors.error}>{TuiGlyphs.cross} {error}</Text>
        </Box>
      )}
    </Box>
  );
}
