import type { ProjectStatsSnapshotView } from "./ProjectStatsSnapshotView.js";

export interface IProjectStatsQuery {
  currentSnapshot(): Promise<ProjectStatsSnapshotView>;
}
