import { UpdateGoalRequest } from "./UpdateGoalRequest.js";
import { UpdateGoalResponse } from "./UpdateGoalResponse.js";

export interface IUpdateGoalGateway {
  updateGoal(request: UpdateGoalRequest): Promise<UpdateGoalResponse>;
}
