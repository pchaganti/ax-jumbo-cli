import React from "react";
import { Wizard } from "../components/Wizard.js";
import type { WizardStepDefinition } from "../components/Wizard.js";

const GOAL_AUTHORING_STEPS: readonly WizardStepDefinition[] = [
  {
    title: "Objective",
    description:
      "State the single outcome this goal should accomplish for the project.",
    fields: [
      {
        key: "objective",
        label: "Objective",
        placeholder: "e.g. Prototype the Goals screen",
      },
    ],
  },
  {
    title: "Criteria",
    description:
      "Define measurable success criteria so review can determine completion.",
    fields: [
      {
        key: "successCriteria",
        label: "Success criteria",
        placeholder: "e.g. List renders status, detail, and action hints",
      },
    ],
  },
  {
    title: "Scope",
    description:
      "Identify the work area and boundaries that keep the goal focused.",
    fields: [
      {
        key: "scopeIn",
        label: "Scope in",
        placeholder: "e.g. src/presentation/tui/screens",
      },
      {
        key: "scopeOut",
        label: "Scope out",
        placeholder: "e.g. src/application",
      },
    ],
  },
  {
    title: "Related Entities",
    description:
      "Capture known memories the goal should consider while being implemented.",
    fields: [
      {
        key: "relatedEntities",
        label: "Related entities",
        placeholder: "e.g. X1 Wizard primitive, C1 Header switcher",
      },
    ],
  },
] as const;

interface GoalAuthoringFlowProps {
  readonly onComplete: (values: Record<string, string>) => void;
  readonly onCancel: () => void;
}

export function GoalAuthoringFlow({
  onComplete,
  onCancel,
}: GoalAuthoringFlowProps): React.ReactElement {
  return (
    <Wizard
      title="Author Goal"
      steps={GOAL_AUTHORING_STEPS}
      onConfirm={onComplete}
      onCancel={onCancel}
    />
  );
}
