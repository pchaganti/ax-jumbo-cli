import { GoalView } from "../GoalView.js";
import { ArchitectureView } from "../../architecture/ArchitectureView.js";
import { ComponentView } from "../../components/ComponentView.js";
import { DependencyView } from "../../dependencies/DependencyView.js";
import { DecisionView } from "../../decisions/DecisionView.js";
import { InvariantView } from "../../invariants/InvariantView.js";
import { GuidelineView } from "../../guidelines/GuidelineView.js";
import { RelatedContext } from "./RelatedContext.js";

/**
 * GoalContext - Core relation-based context for a goal.
 *
 * Assembled at query time from:
 * - Goal (core entity)
 * - Relations (edges in knowledge graph)
 * - Related entities (fetched via batch readers)
 *
 * All arrays are guaranteed non-null and contain no null items.
 * Related entities are wrapped in RelatedContext<T> to provide
 * relation metadata (type + description) about WHY the relation exists.
 *
 * Callers can map this to specific views:
 * - StartGoalContextView (enriched with LLM prompts)
 * - ReviewGoalContextView (enriched with review-specific data)
 * - etc.
 */
export interface GoalContext {
  readonly goal: GoalView;
  readonly components: ReadonlyArray<RelatedContext<ComponentView>>;
  readonly dependencies: ReadonlyArray<RelatedContext<DependencyView>>;
  readonly decisions: ReadonlyArray<RelatedContext<DecisionView>>;
  readonly invariants: ReadonlyArray<RelatedContext<InvariantView>>;
  readonly guidelines: ReadonlyArray<RelatedContext<GuidelineView>>;
  readonly architecture: ArchitectureView | null;
}
