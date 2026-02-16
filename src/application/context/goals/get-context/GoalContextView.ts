import { GoalView } from "../GoalView.js";
import { ArchitectureView } from "../../architecture/ArchitectureView.js";
import { ComponentView } from "../../components/ComponentView.js";
import { DependencyView } from "../../dependencies/DependencyView.js";
import { DecisionView } from "../../decisions/DecisionView.js";
import { InvariantView } from "../../invariants/InvariantView.js";
import { GuidelineView } from "../../guidelines/GuidelineView.js";
import { RelatedContext } from "./RelatedContext.js";

/**
 * GoalContextView - Presentation-layer view of goal context.
 *
 * Stable interface for the presentation layer that uses RelatedContext<T>.
 * This gives us flexibility to:
 * - Filter/obfuscate sensitive properties
 * - Add presentation-specific enrichments
 * - Evolve independently from GoalContext
 *
 * Mapped from GoalContext by GoalContextViewMapper.
 */
export interface GoalContextView {
  readonly goal: GoalView;
  readonly components: ReadonlyArray<RelatedContext<ComponentView>>;
  readonly dependencies: ReadonlyArray<RelatedContext<DependencyView>>;
  readonly decisions: ReadonlyArray<RelatedContext<DecisionView>>;
  readonly invariants: ReadonlyArray<RelatedContext<InvariantView>>;
  readonly guidelines: ReadonlyArray<RelatedContext<GuidelineView>>;
  readonly architecture: ArchitectureView | null;
}
