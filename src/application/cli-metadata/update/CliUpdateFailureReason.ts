export const CliUpdateFailureReason = {
  Offline: "offline",
  RegistryError: "registry-error",
  VersionParseFailure: "version-parse-failure",
  SelfUpgradeUnavailable: "self-upgrade-unavailable",
  UpgradeFailed: "upgrade-failed",
} as const;

export type CliUpdateFailureReason =
  (typeof CliUpdateFailureReason)[keyof typeof CliUpdateFailureReason];
