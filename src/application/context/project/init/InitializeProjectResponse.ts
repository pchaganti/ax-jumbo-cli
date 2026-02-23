import { PlannedFileChange } from "./PlannedFileChange.js";

export interface InitializeProjectResponse {
  readonly projectId: string;
  readonly changes: PlannedFileChange[];
}
