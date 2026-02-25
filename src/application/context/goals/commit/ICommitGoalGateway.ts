import { CommitGoalRequest } from "./CommitGoalRequest.js";
import { CommitGoalResponse } from "./CommitGoalResponse.js";

export interface ICommitGoalGateway {
  commitGoal(request: CommitGoalRequest): Promise<CommitGoalResponse>;
}
