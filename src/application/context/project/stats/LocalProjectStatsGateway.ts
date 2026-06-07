import type { IProjectStatsGateway } from "./IProjectStatsGateway.js";
import type { GetProjectStatsQueryHandler } from "./GetProjectStatsQueryHandler.js";
import type { ProjectStatsRequest } from "./ProjectStatsRequest.js";
import type { ProjectStatsResponse } from "./ProjectStatsResponse.js";

export class LocalProjectStatsGateway implements IProjectStatsGateway {
  constructor(private readonly queryHandler: GetProjectStatsQueryHandler) {}

  async getProjectStats(
    request: ProjectStatsRequest,
  ): Promise<ProjectStatsResponse> {
    return {
      snapshot: await this.queryHandler.execute(request),
    };
  }
}
