import React from "react";
import { Box, Text } from "ink";
import { BaseColors, SemanticColors, TuiLayout } from "../../shared/DesignTokens.js";
import { KeyBadge } from "../components/KeyBadge.js";
import { SectionHeading } from "../components/SectionHeading.js";

export function CockpitPrimedEmptyView(): React.ReactElement {
  return (
    <Box flexDirection="column" paddingX={2} paddingY={1} width={TuiLayout.bannerWidth}>
      <Box marginTop={1} flexDirection="column" alignItems="center">
        <Text color={SemanticColors.primary} wrap="wrap">
          Project memory is stored. Ready to create your first goal.
        </Text>
      </Box>
      <Box
        marginTop={2}
        flexDirection="column"
        alignItems="center"
        width="100%">
        <Box>
          <Text color={SemanticColors.primary}>Press </Text>
          <KeyBadge char="g" />
          <Text color={SemanticColors.primary}> to add a goal</Text>
        </Box>
        <Box marginTop={1}>
          <Text color={SemanticColors.muted}>
            or run 'jumbo goal add' from another terminal
          </Text>
        </Box>
      </Box>
      <Box marginTop={1}>
        <SectionHeading title="A PRIMER ON GOALS" />
      </Box>
      <Box marginTop={1}>
        <Text color={SemanticColors.primary} wrap="wrap">
          Goals are the center of how Jumbo turns project memory into useful
          work. A goal is simply an objective, success criteria, and scope.
        </Text>
      </Box>
      <Box marginTop={1}>
        <Text color={SemanticColors.primary} wrap="wrap">
          That gives Jumbo's memory something to organize around. When the agent
          starts the goal, Jumbo provides a focused context packet with relevant
          project knowledge and execution instructions.
        </Text>
      </Box>
      <Box marginTop={1}>
        <Text color={SemanticColors.primary} wrap="wrap">
          New memories are captured as corrections and discoveries arise, and
          each completed goal leaves the system better prepared for the next one.
        </Text>
      </Box>
    </Box>
  );
}
