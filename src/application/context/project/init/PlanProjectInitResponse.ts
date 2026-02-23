import { PlannedFileChange } from "./PlannedFileChange.js";

export interface PlanProjectInitResponse {
  readonly plannedChanges: PlannedFileChange[];
}
