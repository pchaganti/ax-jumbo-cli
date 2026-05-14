import React from "react";
import { Wizard } from "../components/Wizard.js";
import type { WizardStepDefinition } from "../components/Wizard.js";

const INIT_STEPS: readonly WizardStepDefinition[] = [
  {
    title: "Project Name",
    description:
      "What is your project called? This name will appear in context packets served to coding agents.",
    fields: [
      {
        key: "projectName",
        label: "Project name",
        placeholder: "e.g. Jumbo",
      },
    ],
  },
  {
    title: "Purpose",
    description:
      "Describe the purpose of your project. What problem does it solve? This helps agents understand the north-star.",
    fields: [
      {
        key: "purpose",
        label: "Project purpose",
        placeholder: "e.g. Context management for LLM coding agents",
      },
    ],
  },
  {
    title: "Audiences",
    description:
      "Who are the primary audiences for your project? Understanding your users helps agents make better decisions.",
    fields: [
      {
        key: "audienceName",
        label: "Audience name",
        placeholder: "e.g. Software Developers",
      },
      {
        key: "audienceDescription",
        label: "Audience description",
        placeholder: "e.g. Developers collaborating with LLM coding agents",
      },
    ],
  },
  {
    title: "Value Propositions",
    description:
      "What value does your project deliver? These propositions guide what capabilities matter most.",
    fields: [
      {
        key: "valueTitle",
        label: "Value proposition title",
        placeholder: "e.g. Persistent context across sessions",
      },
      {
        key: "valueBenefit",
        label: "Benefit",
        placeholder: "e.g. Agents never lose important project context",
      },
    ],
  },
] as const;

interface InitFlowProps {
  readonly onComplete: (values: Record<string, string>) => void;
  readonly onCancel: () => void;
}

export function InitFlow({
  onComplete,
  onCancel,
}: InitFlowProps): React.ReactElement {
  return (
    <Wizard
      title="Initialize Project"
      steps={INIT_STEPS}
      onConfirm={onComplete}
      onCancel={onCancel}
    />
  );
}
