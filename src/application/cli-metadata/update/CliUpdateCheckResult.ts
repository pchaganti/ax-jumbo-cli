import type { CliUpdateFailureReason } from "./CliUpdateFailureReason.js";
import type { CliUpgradeFeasibility } from "./CliUpgradeFeasibility.js";

export type CliUpdateCheckResult =
  | {
      readonly status: "up-to-date";
      readonly localVersion: string;
      readonly latestVersion: string;
    }
  | {
      readonly status: "update-available";
      readonly localVersion: string;
      readonly latestVersion: string;
      readonly feasibility: CliUpgradeFeasibility;
    }
  | {
      readonly status: "lookup-failed";
      readonly localVersion: string;
      readonly reason: CliUpdateFailureReason;
      readonly errorType: string;
      readonly message: string;
    }
  | {
      readonly status: "version-parse-failed";
      readonly localVersion: string;
      readonly latestVersion: string;
    };
