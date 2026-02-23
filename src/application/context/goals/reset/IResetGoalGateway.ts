import { ResetGoalRequest } from "./ResetGoalRequest.js";
import { ResetGoalResponse } from "./ResetGoalResponse.js";

export interface IResetGoalGateway {
  resetGoal(request: ResetGoalRequest): Promise<ResetGoalResponse>;
}
