import type { ProjectStatsRequest } from "./ProjectStatsRequest.js";
import type { ProjectStatsResponse } from "./ProjectStatsResponse.js";

export interface IProjectStatsGateway {
  getProjectStats(request: ProjectStatsRequest): Promise<ProjectStatsResponse>;
}
