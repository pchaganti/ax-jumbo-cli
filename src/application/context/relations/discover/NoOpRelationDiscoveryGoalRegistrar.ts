import { IRelationDiscoveryGoalRegistrar } from "./IRelationDiscoveryGoalRegistrar.js";

/**
 * No-op implementation used during database rebuild (event replay).
 * Event replay must not produce side-effects like creating new goals.
 */
export class NoOpRelationDiscoveryGoalRegistrar implements IRelationDiscoveryGoalRegistrar {
  async execute(): Promise<null> {
    return null;
  }
}
