import type { CliPackageVersionLookupResult } from "./CliPackageVersionLookupResult.js";

export interface ICliPackageVersionGateway {
  getLatestVersion(packageName: string): Promise<CliPackageVersionLookupResult>;
}
