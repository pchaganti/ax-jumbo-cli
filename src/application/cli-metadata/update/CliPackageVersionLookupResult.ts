import type { CliUpdateFailureReason } from "./CliUpdateFailureReason.js";

export type CliPackageVersionLookupResult =
  | {
      readonly ok: true;
      readonly version: string;
    }
  | {
      readonly ok: false;
      readonly reason: CliUpdateFailureReason;
      readonly errorType: string;
      readonly message: string;
    };
