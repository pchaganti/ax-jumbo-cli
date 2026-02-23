import { StartGoalRequest } from "./StartGoalRequest.js";
import { StartGoalResponse } from "./StartGoalResponse.js";

export interface IStartGoalGateway {
  startGoal(request: StartGoalRequest): Promise<StartGoalResponse>;
}
