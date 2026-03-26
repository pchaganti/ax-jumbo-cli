import { AvailableAgent } from "./AgentSelection.js";
import { PlannedFileChange } from "./PlannedFileChange.js";

export interface PlanProjectInitResponse {
  readonly availableAgents: readonly AvailableAgent[];
  readonly plannedChanges: PlannedFileChange[];
}
