import { ResumeGoalRequest } from "./ResumeGoalRequest.js";
import { ResumeGoalResponse } from "./ResumeGoalResponse.js";

export interface IResumeGoalGateway {
  resumeGoal(request: ResumeGoalRequest): Promise<ResumeGoalResponse>;
}
