import { UnblockGoalRequest } from "./UnblockGoalRequest.js";
import { UnblockGoalResponse } from "./UnblockGoalResponse.js";

export interface IUnblockGoalGateway {
  unblockGoal(request: UnblockGoalRequest): Promise<UnblockGoalResponse>;
}
