import { IReviewGoalGateway } from "./IReviewGoalGateway.js";
import { ReviewGoalRequest } from "./ReviewGoalRequest.js";
import { ReviewGoalResponse } from "./ReviewGoalResponse.js";
import { SubmitGoalForReviewCommandHandler } from "./SubmitGoalForReviewCommandHandler.js";
import { IGoalSubmitForReviewReader } from "./IGoalSubmitForReviewReader.js";
import { GoalClaimPolicy } from "../claims/GoalClaimPolicy.js";
import { IWorkerIdentityReader } from "../../../host/workers/IWorkerIdentityReader.js";
import { GoalErrorMessages, formatErrorMessage } from "../../../../domain/goals/Constants.js";

export class LocalReviewGoalGateway implements IReviewGoalGateway {
  constructor(
    private readonly commandHandler: SubmitGoalForReviewCommandHandler,
    private readonly goalReader: IGoalSubmitForReviewReader,
    private readonly claimPolicy: GoalClaimPolicy,
    private readonly workerIdentityReader: IWorkerIdentityReader
  ) {}

  async reviewGoal(request: ReviewGoalRequest): Promise<ReviewGoalResponse> {
    // 1. Validate claim ownership - only the claimant can submit for review
    const workerId = this.workerIdentityReader.workerId;
    const claimValidation = this.claimPolicy.canClaim(request.goalId, workerId);
    if (!claimValidation.allowed) {
      throw new Error(
        formatErrorMessage(GoalErrorMessages.GOAL_CLAIMED_BY_ANOTHER_WORKER, {
          expiresAt: claimValidation.existingClaim.claimExpiresAt,
        })
      );
    }

    // 2. Get current goal view to validate existence
    const goalView = await this.goalReader.findById(request.goalId);
    if (!goalView) {
      throw new Error(
        formatErrorMessage(GoalErrorMessages.GOAL_NOT_FOUND, { id: request.goalId })
      );
    }

    // 3. Delegate state change to command handler (validates status transitions and returns enriched context)
    const goalContextView = await this.commandHandler.execute({ goalId: request.goalId });

    // 4. Get updated goal view after state change
    const updatedGoalView = await this.goalReader.findById(request.goalId);
    if (!updatedGoalView) {
      throw new Error(`Goal not found after review submission: ${request.goalId}`);
    }

    return {
      goalId: request.goalId,
      objective: updatedGoalView.objective,
      status: updatedGoalView.status,
      criteria: goalContextView,
    };
  }
}
