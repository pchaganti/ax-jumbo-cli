import React, { useMemo, useState } from "react";
import { Box, Text, useInput } from "ink";
import {
  BaseColors,
  SemanticColors,
  TuiGlyphs,
} from "../../shared/DesignTokens.js";
import { DetailPane } from "../components/DetailPane.js";
import { KeyBadge } from "../components/KeyBadge.js";
import { Panel } from "../components/Panel.js";
import { GoalAuthoringFlow } from "../flows/GoalAuthoringFlow.js";

type GoalStatus =
  | "defined"
  | "refined"
  | "doing"
  | "blocked"
  | "in-review"
  | "done";

interface GoalListEntry {
  readonly id: string;
  readonly title: string;
  readonly status: GoalStatus;
  readonly objective: string;
  readonly criteria: readonly string[];
  readonly scopeIn: readonly string[];
  readonly scopeOut: readonly string[];
  readonly relatedEntities: readonly string[];
  readonly lifecycleActions: readonly string[];
}

const STATUS_FILTERS = [
  "all",
  "defined",
  "refined",
  "doing",
  "blocked",
  "in-review",
  "done",
] as const;
type GoalStatusFilter = (typeof STATUS_FILTERS)[number];

const STATUS_COLORS: Record<GoalStatus, string> = {
  defined: SemanticColors.muted,
  refined: SemanticColors.info,
  doing: SemanticColors.success,
  blocked: SemanticColors.error,
  "in-review": SemanticColors.warning,
  done: BaseColors.brandGreen70,
};

const PLACEHOLDER_GOALS: readonly GoalListEntry[] = [
  {
    id: "goal_s2_prototype",
    title: "Prototype Goals screen",
    status: "doing",
    objective:
      "Render a placeholder Goals screen with list, detail, and lifecycle hints.",
    criteria: [
      "Filterable goal list renders status indicators",
      "Selected goal details are visible",
      "Lifecycle hints match selected status",
    ],
    scopeIn: ["src/presentation/tui/screens", "src/presentation/tui/flows"],
    scopeOut: ["src/application", "src/domain", "src/infrastructure"],
    relatedEntities: ["S2 Goals screen", "X4 Goal authoring wizard"],
    lifecycleActions: ["submit", "block", "pause"],
  },
  {
    id: "goal_x4_authoring",
    title: "Draft goal authoring flow",
    status: "refined",
    objective:
      "Collect objective, criteria, scope, and related entities with the X1 wizard primitive.",
    criteria: [
      "Wizard uses four ordered steps",
      "Scope captures in and out boundaries",
      "Related entities can be entered before submit",
    ],
    scopeIn: ["src/presentation/tui/flows"],
    scopeOut: ["Request wiring", "Persistence"],
    relatedEntities: ["X1 Wizard primitive", "AddGoal future action"],
    lifecycleActions: ["start", "remove", "reset"],
  },
  {
    id: "goal_memory_placeholder",
    title: "Prototype Memory screen",
    status: "defined",
    objective:
      "Sketch memory browsing patterns before wiring real entity state.",
    criteria: ["Category columns render", "Detail view shows selected memory"],
    scopeIn: ["src/presentation/tui/screens"],
    scopeOut: ["Entity Requests"],
    relatedEntities: ["S3 Memory screen"],
    lifecycleActions: ["refine", "start", "remove"],
  },
  {
    id: "goal_daemon_integration",
    title: "Wire daemon controls",
    status: "blocked",
    objective:
      "Connect daemon health controls after subprocess infrastructure exists.",
    criteria: ["Health row shows status", "Failures produce notifications"],
    scopeIn: ["src/presentation/tui/components"],
    scopeOut: ["Daemon implementation"],
    relatedEntities: ["C2 Footer", "C3 Notifications"],
    lifecycleActions: ["unblock", "reset"],
  },
] as const;

const DETAIL_JOIN_SEPARATOR = "\n";

export function GoalsScreen(): React.ReactElement {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filterIndex, setFilterIndex] = useState(0);
  const [authoringOpen, setAuthoringOpen] = useState(false);

  const activeFilter = STATUS_FILTERS[filterIndex];
  const visibleGoals = useMemo(
    () =>
      activeFilter === "all"
        ? PLACEHOLDER_GOALS
        : PLACEHOLDER_GOALS.filter((goal) => goal.status === activeFilter),
    [activeFilter],
  );
  const selectedGoal = visibleGoals[selectedIndex] ?? visibleGoals[0];

  useInput((input, key) => {
    if (authoringOpen) {
      return;
    }

    if (key.downArrow && selectedIndex < visibleGoals.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      return;
    }

    if (key.upArrow && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      return;
    }

    if (key.rightArrow) {
      const nextFilterIndex = (filterIndex + 1) % STATUS_FILTERS.length;
      setFilterIndex(nextFilterIndex);
      setSelectedIndex(0);
      return;
    }

    if (key.leftArrow) {
      const nextFilterIndex =
        filterIndex === 0 ? STATUS_FILTERS.length - 1 : filterIndex - 1;
      setFilterIndex(nextFilterIndex);
      setSelectedIndex(0);
      return;
    }

    if (input === "a" || input === "A") {
      setAuthoringOpen(true);
    }
  });

  const handleAuthoringComplete = (_values: Record<string, string>) => {
    setAuthoringOpen(false);
  };

  const handleAuthoringCancel = () => {
    setAuthoringOpen(false);
  };

  if (authoringOpen) {
    return (
      <GoalAuthoringFlow
        onComplete={handleAuthoringComplete}
        onCancel={handleAuthoringCancel}
      />
    );
  }

  return (
    <Box flexDirection="column" paddingX={1} paddingTop={1} gap={1}>
      <Box justifyContent="space-between">
        <Box flexDirection="column">
          <Text color={SemanticColors.headline} bold>
            Goals
          </Text>
          <Text color={SemanticColors.secondary}>
            Placeholder backlog and lifecycle management
          </Text>
        </Box>
        <Text color={SemanticColors.muted}>
          Filter: <Text color={SemanticColors.accent}>{activeFilter}</Text>
        </Text>
      </Box>

      <Box gap={2}>
        <Panel title="Goal List" width={54}>
          {visibleGoals.map((goal, goalIndex) => {
            const isSelected = goal.id === selectedGoal?.id;
            return (
              <Box key={goal.id}>
                <Text
                  color={isSelected ? SemanticColors.accent : SemanticColors.muted}
                >
                  {isSelected ? TuiGlyphs.selector : " "}
                </Text>
                <Text color={STATUS_COLORS[goal.status]}>
                  {" "}
                  {TuiGlyphs.filledCircle}{" "}
                </Text>
                <Text color={SemanticColors.primary}>{goal.title}</Text>
                <Text color={SemanticColors.muted}> {goal.status}</Text>
                {goalIndex === selectedIndex && (
                  <Text color={SemanticColors.muted}> selected</Text>
                )}
              </Box>
            );
          })}
        </Panel>

        {selectedGoal && (
          <DetailPane
            title="Goal Detail"
            width={74}
            entries={[
              { label: "ID", value: selectedGoal.id },
              { label: "Title", value: selectedGoal.title },
              {
                label: "Status",
                value: selectedGoal.status,
                valueColor: STATUS_COLORS[selectedGoal.status],
              },
              { label: "Objective", value: selectedGoal.objective },
              {
                label: "Criteria",
                value: selectedGoal.criteria.join(DETAIL_JOIN_SEPARATOR),
              },
              {
                label: "Scope in",
                value: selectedGoal.scopeIn.join(DETAIL_JOIN_SEPARATOR),
              },
              {
                label: "Scope out",
                value: selectedGoal.scopeOut.join(DETAIL_JOIN_SEPARATOR),
              },
              {
                label: "Related",
                value: selectedGoal.relatedEntities.join(DETAIL_JOIN_SEPARATOR),
              },
              {
                label: "Actions",
                value: selectedGoal.lifecycleActions.join(DETAIL_JOIN_SEPARATOR),
              },
            ]}
          />
        )}
      </Box>

      {selectedGoal && (
        <Panel title="Action Hints">
          <Box gap={2}>
            {selectedGoal.lifecycleActions.map((action) => (
              <KeyBadge key={action} char={action.charAt(0)} label={action} />
            ))}
            <KeyBadge char="a" label="author" />
            <KeyBadge char="↑↓" label="select" />
            <KeyBadge char="←→" label="filter" />
          </Box>
        </Panel>
      )}
    </Box>
  );
}
