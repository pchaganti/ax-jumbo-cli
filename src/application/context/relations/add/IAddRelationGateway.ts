import { AddRelationRequest } from "./AddRelationRequest.js";
import { AddRelationResponse } from "./AddRelationResponse.js";

export interface IAddRelationGateway {
  addRelation(request: AddRelationRequest): Promise<AddRelationResponse>;
}
