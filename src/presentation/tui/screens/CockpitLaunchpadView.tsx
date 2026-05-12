import React from "react";
import { Box, Text } from "ink";
import { BaseColors, SemanticColors, TuiGlyphs } from "../../shared/DesignTokens.js";
import { SectionHeading } from "../components/SectionHeading.js";
import { StatusIndicator } from "../components/StatusIndicator.js";

const GOAL_STATUS_COLORS: Record<string, string> = {
  doing: SemanticColors.success,
  refused: SemanticColors.muted,
  submitted: SemanticColors.info,
  blocked: SemanticColors.error,
  approved: SemanticColors.accent,
};

const PLACEHOLDER_GOALS = [
  { title: "Implement user authentication blah blah blah blah blah", status: "doing" },
  { title: "Add dashboard analytics", status: "refused" },
  { title: "Write API documentation", status: "submitted" },
  { title: "Refactor database layer", status: "blocked" },
  { title: "Fix skipped state", status: "approved" },
  { title: "Extend Xyz entity", status: "refused" },
];

const PLACEHOLDER_SELECTED_GOAL = {
  meta: [
    { label: "id", value: "abcd1234-5678-90ab-cdef-25ef30dfe323" },
    { label: "title", value: "Add dashboard analytics" },
    { label: "manager", value: "c6a959fb-dfe5-4e96-8b1c-2f2d9d4b9d3d" },
    { label: "prerequisite(s)", value: "fc630366-abe7-ac7b-fe31-5b2347a48bb3" },
  ],
  objective:
    "Integrate analytics tracking into the dashboard to surface usage patterns, " +
    "performance metrics, and user engagement data for stakeholder reporting.",
  criteria: [
    "Dashboard renders analytics widgets with live data",
    "Usage patterns surfaced through chart components",
    "Performance metrics update on configurable interval",
    "User engagement data exportable as CSV",
    "All analytics queries respect tenant isolation",
    "Dashboard loads within acceptable latency threshold",
  ],
  scopeIn: [
    "src/presentation/dashboard",
    "src/application/analytics",
    "src/domain/analytics",
    "tests/presentation/dashboard",
    "tests/application/analytics",
  ],
  invariants: [
    {
      title: "Single Responsibility",
      description:
        "Each class/module has one reason to change.",
    },
    {
      title: "Dependency Inversion",
      description:
        "Depend on abstractions, not concretions. Application depends only on abstractions.",
    },
  ],
};

export function CockpitLaunchpadView(): React.ReactElement {
  return (
    <Box flexDirection="row" paddingX={1} flexGrow={1}>
      <Box flexDirection="column" flexBasis="50%" paddingRight={2}>
        <SectionHeading title="GOALS" />
        {PLACEHOLDER_GOALS.map((goal) => (
          <Box key={goal.title}>
            <Box flexDirection="row">
              <Box flexDirection="column" flexBasis="5%" />
              <Box flexDirection="column" flexBasis="3%">
                <Text color={GOAL_STATUS_COLORS[goal.status] ?? SemanticColors.muted}>
                  {TuiGlyphs.bullet}
                </Text>
              </Box>
              <Box flexDirection="column" flexBasis="72%" flexWrap="wrap">
                <Text color={SemanticColors.primary}>
                  {goal.title.substring(0,34)}{goal.title.length > 35 ? "..." : ""}
                </Text>
              </Box>
              <Box flexDirection="column" flexBasis="20%" flexWrap="wrap">
                <Text color={SemanticColors.muted}>
                  {" "}
                  [{goal.status}]
                </Text>
              </Box>
            </Box>
          </Box>
        ))}
        <Box
          marginTop={1}
          flexDirection="column"
          alignItems="center"
          width="100%"
        >
          <Text>
            <Text color={SemanticColors.primary}>Press </Text>
            <Text color={BaseColors.brandBlue} bold>
              [g]
            </Text>
            <Text color={SemanticColors.primary}> to add a goal</Text>
          </Text>
        </Box>

        <SectionHeading title="WORKERS" />
        <Box flexDirection="column">
          <StatusIndicator label="Auto Goal Refiner" status="active" />
          <StatusIndicator label="Auto Goal Reviewer" status="error" />
          <StatusIndicator label="Auto Goal Implementor" status="error" />
          <StatusIndicator label="Auto Goal Codifier" status="idle" />
        </Box>
      </Box>

      <Box flexDirection="column" flexBasis="50%">
        <SectionHeading title="Goal Details" />
        {PLACEHOLDER_SELECTED_GOAL.meta.map((entry) => (
          <Box key={entry.label}>
            <Box width={18}>
              <Text color={SemanticColors.muted}>{entry.label}:</Text>
            </Box>
            <Text color={SemanticColors.primary}>{entry.value}</Text>
          </Box>
        ))}

        <SectionHeading title="OBJECTIVE" dimmed={true} />
        <Box>
          <Text color={SemanticColors.primary} wrap="wrap">
            {PLACEHOLDER_SELECTED_GOAL.objective}
          </Text>
        </Box>

        <SectionHeading title="CRITERIA" dimmed={true} />
        {PLACEHOLDER_SELECTED_GOAL.criteria.map((criterion) => (
          <Box key={criterion}>
            <Text color={SemanticColors.accent}>{TuiGlyphs.bullet} </Text>
            <Text color={SemanticColors.primary}>{criterion}</Text>
          </Box>
        ))}

        <SectionHeading title="SCOPE-IN" />
        {PLACEHOLDER_SELECTED_GOAL.scopeIn.map((path) => (
          <Box key={path}>
            <Text color={SemanticColors.accent}>{TuiGlyphs.bullet} </Text>
            <Text color={SemanticColors.primary}>{path}</Text>
          </Box>
        ))}

        <SectionHeading title="RELATED-INVARIANTS" />
        {PLACEHOLDER_SELECTED_GOAL.invariants.map((invariant) => (
          <Box key={invariant.title} flexDirection="column" marginBottom={1}>
            <Text color={SemanticColors.accent} bold>
              {invariant.title}
            </Text>
            <Box paddingLeft={2}>
              <Text color={SemanticColors.primary} wrap="wrap">
                {invariant.description}
              </Text>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
