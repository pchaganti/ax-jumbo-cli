import { RefineGoalRequest } from "./RefineGoalRequest.js";
import { RefineGoalResponse } from "./RefineGoalResponse.js";

export interface IRefineGoalGateway {
  refineGoal(request: RefineGoalRequest): Promise<RefineGoalResponse>;
}
