import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import { SemanticColors } from "../../shared/DesignTokens.js";
import { KeyBadge } from "../components/KeyBadge.js";
import { Panel } from "../components/Panel.js";
import { ComponentAddFlow } from "../flows/component-add/ComponentAddFlow.js";
import { DecisionAddFlow } from "../flows/decision-add/DecisionAddFlow.js";
import { DependencyAddFlow } from "../flows/dependency-add/DependencyAddFlow.js";
import { GuidelineAddFlow } from "../flows/guideline-add/GuidelineAddFlow.js";
import { InvariantAddFlow } from "../flows/invariant-add/InvariantAddFlow.js";
import { EntityColumn } from "./memory/EntityColumn.js";
import { EntityDetailView } from "./memory/EntityDetailView.js";
import type {
  ComponentEntityRow,
  DecisionEntityRow,
  DependencyEntityRow,
  GuidelineEntityRow,
  InvariantEntityRow,
  MemoryEntityType,
} from "./memory/MemoryEntityShapes.js";
import {
  PLACEHOLDER_COMPONENTS,
  PLACEHOLDER_DECISIONS,
  PLACEHOLDER_DEPENDENCIES,
  PLACEHOLDER_GUIDELINES,
  PLACEHOLDER_INVARIANTS,
} from "./memory/MemoryPlaceholderData.js";

const COLUMN_ORDER: readonly MemoryEntityType[] = [
  "decision",
  "invariant",
  "component",
  "dependency",
  "guideline",
];

const COLUMN_WIDTH = 26;
const DETAIL_WIDTH = 60;

const COLUMN_TITLES: Record<MemoryEntityType, string> = {
  decision: "Decisions",
  invariant: "Invariants",
  component: "Components",
  dependency: "Dependencies",
  guideline: "Guidelines",
};

interface ActiveSelection {
  readonly entityType: MemoryEntityType;
  readonly rowIndex: number;
}

export function MemoryScreen(): React.ReactElement {
  const [selection, setSelection] = useState<ActiveSelection>({
    entityType: "decision",
    rowIndex: 0,
  });
  const [activeFlow, setActiveFlow] = useState<MemoryEntityType | null>(null);

  const columnRowsByType = {
    decision: PLACEHOLDER_DECISIONS,
    invariant: PLACEHOLDER_INVARIANTS,
    component: PLACEHOLDER_COMPONENTS,
    dependency: PLACEHOLDER_DEPENDENCIES,
    guideline: PLACEHOLDER_GUIDELINES,
  } as const;

  useInput((input, key) => {
    if (activeFlow !== null) {
      return;
    }

    if (key.rightArrow) {
      const currentColumnIndex = COLUMN_ORDER.indexOf(selection.entityType);
      const nextColumnIndex =
        (currentColumnIndex + 1) % COLUMN_ORDER.length;
      setSelection({
        entityType: COLUMN_ORDER[nextColumnIndex],
        rowIndex: 0,
      });
      return;
    }

    if (key.leftArrow) {
      const currentColumnIndex = COLUMN_ORDER.indexOf(selection.entityType);
      const previousColumnIndex =
        currentColumnIndex === 0
          ? COLUMN_ORDER.length - 1
          : currentColumnIndex - 1;
      setSelection({
        entityType: COLUMN_ORDER[previousColumnIndex],
        rowIndex: 0,
      });
      return;
    }

    const currentRows = columnRowsByType[selection.entityType];

    if (key.downArrow && selection.rowIndex < currentRows.length - 1) {
      setSelection({
        entityType: selection.entityType,
        rowIndex: selection.rowIndex + 1,
      });
      return;
    }

    if (key.upArrow && selection.rowIndex > 0) {
      setSelection({
        entityType: selection.entityType,
        rowIndex: selection.rowIndex - 1,
      });
      return;
    }

    if (input === "a" || input === "A") {
      setActiveFlow(selection.entityType);
    }
  });

  if (activeFlow !== null) {
    const closeFlow = () => setActiveFlow(null);
    const handleConfirm = (_values: Record<string, string>) => closeFlow();
    switch (activeFlow) {
      case "component":
        return (
          <ComponentAddFlow onComplete={handleConfirm} onCancel={closeFlow} />
        );
      case "decision":
        return (
          <DecisionAddFlow onComplete={handleConfirm} onCancel={closeFlow} />
        );
      case "dependency":
        return (
          <DependencyAddFlow onComplete={handleConfirm} onCancel={closeFlow} />
        );
      case "guideline":
        return (
          <GuidelineAddFlow onComplete={handleConfirm} onCancel={closeFlow} />
        );
      case "invariant":
        return (
          <InvariantAddFlow onComplete={handleConfirm} onCancel={closeFlow} />
        );
    }
  }

  const activeRows = columnRowsByType[selection.entityType];
  const selectedEntity = activeRows[selection.rowIndex];

  return (
    <Box flexDirection="column" paddingX={1} paddingTop={1} gap={1}>
      <Box flexDirection="column">
        <Text color={SemanticColors.headline} bold>
          Memory
        </Text>
        <Text color={SemanticColors.secondary}>
          Decisions, invariants, components, dependencies, guidelines
        </Text>
      </Box>

      <Box gap={1}>
        {COLUMN_ORDER.map((entityType) => (
          <EntityColumn
            key={entityType}
            title={COLUMN_TITLES[entityType]}
            entries={columnRowsByType[entityType].map((row) => ({
              id: row.id,
              label: columnLabelForRow(entityType, row),
            }))}
            selectedId={
              selection.entityType === entityType && selectedEntity
                ? selectedEntity.id
                : undefined
            }
            isActive={selection.entityType === entityType}
            width={COLUMN_WIDTH}
          />
        ))}
      </Box>

      {selectedEntity && (
        <EntityDetailView
          entityType={selection.entityType}
          entity={selectedEntity}
          width={DETAIL_WIDTH}
        />
      )}

      <Panel title="Action Hints">
        <Box gap={2}>
          <KeyBadge char="↑↓" label="select row" />
          <KeyBadge char="←→" label="switch column" />
          <KeyBadge char="a" label="add entity" />
        </Box>
      </Panel>
    </Box>
  );
}

function columnLabelForRow(
  entityType: MemoryEntityType,
  row:
    | DecisionEntityRow
    | InvariantEntityRow
    | ComponentEntityRow
    | DependencyEntityRow
    | GuidelineEntityRow,
): string {
  switch (entityType) {
    case "decision":
      return (row as DecisionEntityRow).title;
    case "invariant":
      return (row as InvariantEntityRow).title;
    case "component":
      return (row as ComponentEntityRow).name;
    case "dependency":
      return (row as DependencyEntityRow).name;
    case "guideline":
      return (row as GuidelineEntityRow).title;
  }
}
