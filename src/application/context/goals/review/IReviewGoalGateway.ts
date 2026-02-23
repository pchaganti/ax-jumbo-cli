import { ReviewGoalRequest } from "./ReviewGoalRequest.js";
import { ReviewGoalResponse } from "./ReviewGoalResponse.js";

export interface IReviewGoalGateway {
  reviewGoal(request: ReviewGoalRequest): Promise<ReviewGoalResponse>;
}
