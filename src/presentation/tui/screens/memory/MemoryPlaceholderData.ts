import type {
  ComponentEntityRow,
  DecisionEntityRow,
  DependencyEntityRow,
  GuidelineEntityRow,
  InvariantEntityRow,
} from "./MemoryEntityShapes.js";

export const PLACEHOLDER_DECISIONS: readonly DecisionEntityRow[] = [
  {
    id: "decision_node16_resolution",
    title: "Use Node16 module resolution",
    context: "ESM migration required a stable resolver setting.",
    rationale: "Equivalent to NodeNext for current LTS, non-experimental.",
    alternatives: ["NodeNext", "Classic"],
    consequences: "Locked into Node16-style relative .js imports.",
  },
  {
    id: "decision_inquirer_function_api",
    title: "Use @inquirer/prompts function API",
    context: "Inquirer v13 deprecated the inquirer.prompt object.",
    rationale: "Typed, ESM-compatible, aligned with current API.",
    alternatives: ["Legacy inquirer.prompt"],
    consequences: "All prompts use direct function imports.",
  },
  {
    id: "decision_output_builder_pattern",
    title: "OutputBuilder pattern for CLI output",
    context: "Commands need dual human + structured output modes.",
    rationale: "Single composition point for terminal and JSON renders.",
    alternatives: ["Ad-hoc YamlFormatter", "Per-command render forks"],
    consequences: "All new commands build through OutputBuilder.",
  },
] as const;

export const PLACEHOLDER_INVARIANTS: readonly InvariantEntityRow[] = [
  {
    id: "invariant_explicit_names",
    title: "Names must be explicit and self-documenting",
    description:
      "Identifiers should reveal architectural role without code inspection.",
    rationale: "Discoverability and reduced cognitive load.",
  },
  {
    id: "invariant_clean_screaming_architecture",
    title: "Clean Screaming Architecture",
    description:
      "Layered boundaries: Domain → Application → Infrastructure → Presentation.",
    rationale: "Each layer's directory names should scream the domain.",
  },
  {
    id: "invariant_one_class_per_file",
    title: "One class per file",
    description: "Each TypeScript file contains exactly one class definition.",
    rationale: "Single-responsibility at the file level.",
  },
  {
    id: "invariant_no_junk_drawers",
    title: "No junk drawers",
    description: "No services/, utils/, managers/ catch-alls.",
    rationale: "Organize by domain concept, not technical category.",
  },
] as const;

export const PLACEHOLDER_COMPONENTS: readonly ComponentEntityRow[] = [
  {
    id: "component_add_decision_handler",
    name: "AddDecisionCommandHandler",
    type: "application",
    description: "Orchestrates architectural decision creation.",
    responsibility: "Invoke aggregate logic and persist DecisionAdded events.",
    path: "src/application/context/decisions/add",
  },
  {
    id: "component_goal_show_builder",
    name: "GoalShowOutputBuilder",
    type: "presentation",
    description: "Renders goal show command output.",
    responsibility: "Compose Band 1 / Band 2 layout with design tokens.",
    path: "src/presentation/cli/goals/show",
  },
  {
    id: "component_output_layout",
    name: "OutputLayout",
    type: "presentation",
    description: "Shared design tokens for CLI output builders.",
    responsibility: "Provide accent bar, headings, meta fields, dividers.",
    path: "src/presentation/shared",
  },
] as const;

export const PLACEHOLDER_DEPENDENCIES: readonly DependencyEntityRow[] = [
  {
    id: "dependency_typescript",
    name: "TypeScript",
    ecosystem: "npm",
    packageName: "typescript",
    versionConstraint: "^6.0.3",
    endpoint: "",
    contract: "Strict TypeScript compiler.",
  },
  {
    id: "dependency_jest",
    name: "Jest",
    ecosystem: "npm",
    packageName: "jest",
    versionConstraint: "^30.3.0",
    endpoint: "",
    contract: "Test runner with ESM support.",
  },
  {
    id: "dependency_inquirer",
    name: "Inquirer Prompts",
    ecosystem: "npm",
    packageName: "@inquirer/prompts",
    versionConstraint: "^8.4.2",
    endpoint: "",
    contract: "Interactive CLI prompts.",
  },
] as const;

export const PLACEHOLDER_GUIDELINES: readonly GuidelineEntityRow[] = [
  {
    id: "guideline_export_type_barrels",
    title: "Use export type for interface barrels",
    category: "codingStyle",
    description:
      "Re-export TypeScript interfaces with export type { ... } from barrel files.",
    rationale: "ESM validates named exports at runtime; erased interfaces error.",
    examples: ["export type { Foo } from './Foo.js';"],
  },
  {
    id: "guideline_esm_module_mocks",
    title: "Use jest.unstable_mockModule for ESM",
    category: "testing",
    description:
      "Mock ESM modules with jest.unstable_mockModule and dynamic import.",
    rationale: "jest.mock does not hoist in ESM mode.",
    examples: [],
  },
  {
    id: "guideline_windows_scripts",
    title: "Scripts must work on Windows without WSL",
    category: "process",
    description: "Prefer Node.js scripts using node:fs and node:path.",
    rationale: "Cross-platform contributor experience.",
    examples: [],
  },
] as const;
