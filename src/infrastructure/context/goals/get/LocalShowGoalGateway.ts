import { IShowGoalGateway } from "../../../../application/context/goals/get/IShowGoalGateway.js";
import { ShowGoalRequest } from "../../../../application/context/goals/get/ShowGoalRequest.js";
import { ShowGoalResponse } from "../../../../application/context/goals/get/ShowGoalResponse.js";
import { GoalContextQueryHandler } from "../../../../application/context/goals/get/GoalContextQueryHandler.js";

export class LocalShowGoalGateway implements IShowGoalGateway {
  constructor(
    private readonly goalContextQueryHandler: GoalContextQueryHandler
  ) {}

  async showGoal(request: ShowGoalRequest): Promise<ShowGoalResponse> {
    const contextualGoalView = await this.goalContextQueryHandler.execute(request.goalId);
    return { contextualGoalView };
  }
}
