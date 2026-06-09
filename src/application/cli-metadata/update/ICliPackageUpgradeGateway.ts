import type { CliUpgradeFeasibility } from "./CliUpgradeFeasibility.js";
import type { CliUpgradeResult } from "./CliUpgradeResult.js";

export interface ICliPackageUpgradeGateway {
  evaluate(): Promise<CliUpgradeFeasibility>;
  upgrade(targetVersion: string): Promise<CliUpgradeResult>;
}
