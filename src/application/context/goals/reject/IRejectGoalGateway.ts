import { RejectGoalRequest } from "./RejectGoalRequest.js";
import { RejectGoalResponse } from "./RejectGoalResponse.js";

export interface IRejectGoalGateway {
  rejectGoal(request: RejectGoalRequest): Promise<RejectGoalResponse>;
}
