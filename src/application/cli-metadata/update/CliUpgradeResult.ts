import type { CliUpdateFailureReason } from "./CliUpdateFailureReason.js";

export type CliUpgradeResult =
  | {
      readonly ok: true;
      readonly message: string;
    }
  | {
      readonly ok: false;
      readonly reason: CliUpdateFailureReason;
      readonly guidance: string;
      readonly errorType: string;
      readonly message: string;
    };
