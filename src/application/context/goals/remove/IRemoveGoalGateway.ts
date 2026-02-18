import { RemoveGoalRequest } from "./RemoveGoalRequest.js";
import { RemoveGoalResponse } from "./RemoveGoalResponse.js";

export interface IRemoveGoalGateway {
  removeGoal(request: RemoveGoalRequest): Promise<RemoveGoalResponse>;
}
