import type { CliUpdateFailureReason } from "./CliUpdateFailureReason.js";

export type CliUpgradeFeasibility =
  | {
      readonly feasible: true;
      readonly command: string;
      readonly args: readonly string[];
    }
  | {
      readonly feasible: false;
      readonly reason: CliUpdateFailureReason;
      readonly guidance: string;
    };
