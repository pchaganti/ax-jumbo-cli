import { ShowGoalRequest } from "./ShowGoalRequest.js";
import { ShowGoalResponse } from "./ShowGoalResponse.js";

export interface IShowGoalGateway {
  showGoal(request: ShowGoalRequest): Promise<ShowGoalResponse>;
}
