import React, { useMemo, useState } from "react";
import { Box, Text, useInput } from "ink";
import {
  BaseColors,
  SemanticColors,
  TuiGlyphs,
  TuiLayout,
} from "../../shared/DesignTokens.js";
import type { GoalStatusType } from "../../../domain/goals/Constants.js";
import type { GoalView } from "../../../application/context/goals/GoalView.js";
import { DetailPane } from "../components/DetailPane.js";
import { KeyBadge } from "../components/KeyBadge.js";
import { Panel } from "../components/Panel.js";
import { GoalAuthoringFlow } from "../flows/GoalAuthoringFlow.js";
import { useGoalsList } from "../state/TuiStateReader.js";

type DisplayGoalStatus =
  | "defined"
  | "refined"
  | "doing"
  | "blocked"
  | "in-review"
  | "done"
  | "paused"
  | "approved"
  | "rejected"
  | "submitted"
  | "codifying"
  | "in-refinement"
  | "unblocked";

interface GoalListEntry {
  readonly id: string;
  readonly title: string;
  readonly status: DisplayGoalStatus;
  readonly objective: string;
  readonly criteria: readonly string[];
  readonly scopeIn: readonly string[];
  readonly scopeOut: readonly string[];
  readonly progress: readonly string[];
  readonly prerequisiteGoals: readonly string[];
  readonly note?: string;
  readonly reviewIssues?: string;
  readonly nextGoalId?: string;
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

const STATUS_COLORS: Record<DisplayGoalStatus, string> = {
  defined: SemanticColors.muted,
  refined: SemanticColors.info,
  doing: SemanticColors.success,
  blocked: SemanticColors.error,
  "in-review": SemanticColors.warning,
  done: BaseColors.brandGreen70,
  paused: SemanticColors.warning,
  approved: SemanticColors.success,
  rejected: SemanticColors.error,
  submitted: SemanticColors.info,
  codifying: SemanticColors.accent,
  "in-refinement": SemanticColors.info,
  unblocked: SemanticColors.warning,
};

const DETAIL_JOIN_SEPARATOR = "\n";
const EMPTY_FIELD_VALUE = "None";

export function GoalsScreen(): React.ReactElement {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filterIndex, setFilterIndex] = useState(0);
  const [authoringOpen, setAuthoringOpen] = useState(false);

  const activeFilter = STATUS_FILTERS[filterIndex];
  const requestedStatus =
    activeFilter === "all" ? undefined : (activeFilter as GoalStatusType);
  const goalsList = useGoalsList(requestedStatus);
  const visibleGoals = useMemo(
    () => {
      const responseGoals = goalsList.data?.goals;

      if (responseGoals !== undefined) {
        return responseGoals.map(toGoalListEntry);
      }

      return [];
    },
    [goalsList.data],
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
            Backlog and lifecycle management
          </Text>
        </Box>
        <Text color={SemanticColors.muted}>
          Filter: <Text color={SemanticColors.accent}>{activeFilter}</Text>
        </Text>
      </Box>

      <Box gap={2}>
        <Panel title="Goal List" width={TuiLayout.listPanelWidth}>
          {goalsList.loading && goalsList.data === null && (
            <Text color={SemanticColors.muted}>Loading goals</Text>
          )}
          {goalsList.error !== null && (
            <Text color={SemanticColors.error}>{goalsList.error.message}</Text>
          )}
          {!goalsList.loading &&
            goalsList.error === null &&
            visibleGoals.length === 0 && (
              <Text color={SemanticColors.muted}>No goals available</Text>
            )}
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
            width={TuiLayout.detailPanelWidth}
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
                label: "Prerequisites",
                value:
                  selectedGoal.prerequisiteGoals
                    .join(DETAIL_JOIN_SEPARATOR) || EMPTY_FIELD_VALUE,
              },
              {
                label: "Progress",
                value:
                  selectedGoal.progress.join(DETAIL_JOIN_SEPARATOR)
                  || EMPTY_FIELD_VALUE,
              },
              { label: "Note", value: selectedGoal.note ?? EMPTY_FIELD_VALUE },
              {
                label: "Review issues",
                value: selectedGoal.reviewIssues ?? EMPTY_FIELD_VALUE,
              },
              {
                label: "Next goal",
                value: selectedGoal.nextGoalId ?? EMPTY_FIELD_VALUE,
              },
            ]}
          />
        )}
      </Box>

      {selectedGoal && (
        <Panel title="Action Hints">
          <Box gap={2}>
            <KeyBadge char="a" label="author" />
            <KeyBadge char="↑↓" label="select" />
            <KeyBadge char="←→" label="filter" />
          </Box>
        </Panel>
      )}
    </Box>
  );
}

function toGoalListEntry(goal: GoalView): GoalListEntry {
  return {
    id: goal.goalId,
    title: goal.title,
    status: goal.status as DisplayGoalStatus,
    objective: goal.objective,
    criteria: goal.successCriteria,
    scopeIn: goal.scopeIn,
    scopeOut: goal.scopeOut,
    progress: goal.progress,
    prerequisiteGoals: goal.prerequisiteGoals ?? [],
    note: goal.note,
    reviewIssues: goal.reviewIssues,
    nextGoalId: goal.nextGoalId,
  };
}
