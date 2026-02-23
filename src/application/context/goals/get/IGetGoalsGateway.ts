import { GetGoalsRequest } from "./GetGoalsRequest.js";
import { GetGoalsResponse } from "./GetGoalsResponse.js";

export interface IGetGoalsGateway {
  getGoals(request: GetGoalsRequest): Promise<GetGoalsResponse>;
}
