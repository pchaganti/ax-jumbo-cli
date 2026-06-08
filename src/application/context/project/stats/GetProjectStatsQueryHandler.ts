import type { IProjectStatsQuery } from "./IProjectStatsQuery.js";
import type { ProjectStatsRequest } from "./ProjectStatsRequest.js";
import type { ProjectStatsSnapshotView } from "./ProjectStatsSnapshotView.js";

export class GetProjectStatsQueryHandler {
  constructor(private readonly query: IProjectStatsQuery) {}

  async execute(
    _request: ProjectStatsRequest = {},
  ): Promise<ProjectStatsSnapshotView> {
    return this.query.currentSnapshot();
  }
}
