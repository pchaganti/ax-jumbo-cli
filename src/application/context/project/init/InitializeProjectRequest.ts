import { AgentId } from "./AgentSelection.js";

export interface InitializeProjectRequest {
  readonly name: string;
  readonly purpose: string | undefined;
  readonly projectRoot: string;
  readonly selectedAgentIds?: readonly AgentId[];
}
