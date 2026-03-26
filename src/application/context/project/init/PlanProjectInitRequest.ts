import { AgentId } from "./AgentSelection.js";

export interface PlanProjectInitRequest {
  readonly projectRoot: string;
  readonly selectedAgentIds?: readonly AgentId[];
}
