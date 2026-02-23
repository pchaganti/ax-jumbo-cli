import { AddDecisionRequest } from "./AddDecisionRequest.js";
import { AddDecisionResponse } from "./AddDecisionResponse.js";

export interface IAddDecisionGateway {
  addDecision(request: AddDecisionRequest): Promise<AddDecisionResponse>;
}
