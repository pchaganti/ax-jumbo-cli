import { QualifyGoalRequest } from "./QualifyGoalRequest.js";
import { QualifyGoalResponse } from "./QualifyGoalResponse.js";

export interface IQualifyGoalGateway {
  qualifyGoal(request: QualifyGoalRequest): Promise<QualifyGoalResponse>;
}
