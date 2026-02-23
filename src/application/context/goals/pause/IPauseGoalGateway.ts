import { PauseGoalRequest } from "./PauseGoalRequest.js";
import { PauseGoalResponse } from "./PauseGoalResponse.js";

export interface IPauseGoalGateway {
  pauseGoal(request: PauseGoalRequest): Promise<PauseGoalResponse>;
}
