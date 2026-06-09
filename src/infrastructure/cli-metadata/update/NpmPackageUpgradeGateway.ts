import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import type { ILogger } from "../../../application/logging/ILogger.js";
import type { ITelemetryClient } from "../../../application/telemetry/ITelemetryClient.js";
import { CliPackageName } from "../../../application/cli-metadata/update/CliPackageName.js";
import type { CliUpgradeFeasibility } from "../../../application/cli-metadata/update/CliUpgradeFeasibility.js";
import type { CliUpgradeResult } from "../../../application/cli-metadata/update/CliUpgradeResult.js";
import { CliUpdateFailureReason } from "../../../application/cli-metadata/update/CliUpdateFailureReason.js";
import type { ICliPackageUpgradeGateway } from "../../../application/cli-metadata/update/ICliPackageUpgradeGateway.js";

const execFileAsync = promisify(execFile);
const NPM_COMMAND = process.platform === "win32" ? "npm.cmd" : "npm";
const NPM_UPGRADE_TIMEOUT_MS = 120_000;
const NPM_FEASIBILITY_LOOKUP_COMPLETED_EVENT =
  "npm_upgrade_feasibility_lookup_completed";
const NPM_PACKAGE_UPGRADE_COMPLETED_EVENT = "npm_package_upgrade_completed";
const MANUAL_UPDATE_GUIDANCE = `Run npm install -g ${CliPackageName}@latest`;

export class NpmPackageUpgradeGateway implements ICliPackageUpgradeGateway {
  constructor(
    private readonly packageEntryPointPath: string = process.argv[1] ?? "",
    private readonly telemetryClient?: Pick<ITelemetryClient, "track">,
    private readonly logger?: Pick<ILogger, "warn" | "info">,
  ) {}

  async evaluate(): Promise<CliUpgradeFeasibility> {
    const startedAt = Date.now();

    try {
      const packageRoots = this.findPackageRoots(this.packageEntryPointPath);
      const globalRoot = await this.getGlobalNodeModulesRoot();
      const safePackageRoot = packageRoots.find(
        (packageRoot) =>
          this.isInsideDirectory(packageRoot, globalRoot) &&
          !this.isSourceCheckout(packageRoot),
      );

      if (safePackageRoot === undefined) {
        return this.unavailable(
          startedAt,
          "PackageInstallSourceUnsupported",
        );
      }

      const result: CliUpgradeFeasibility = {
        feasible: true,
        command: NPM_COMMAND,
        args: ["install", "-g", `${CliPackageName}@latest`],
      };
      this.trackFeasibility(startedAt, result);
      return result;
    } catch (error) {
      const errorType = error instanceof Error ? error.name : "UnknownError";
      this.logger?.warn("npm upgrade feasibility lookup failed", {
        errorType,
      });
      return this.unavailable(startedAt, errorType);
    }
  }

  async upgrade(targetVersion: string): Promise<CliUpgradeResult> {
    const startedAt = Date.now();

    try {
      await execFileAsync(
        NPM_COMMAND,
        ["install", "-g", `${CliPackageName}@${targetVersion}`],
        { timeout: NPM_UPGRADE_TIMEOUT_MS },
      );
      const result: CliUpgradeResult = {
        ok: true,
        message: "Upgrade completed. Restart Jumbo to use the new version.",
      };
      this.trackUpgrade(startedAt, targetVersion, result);
      this.logger?.info("npm package upgrade completed", { targetVersion });
      return result;
    } catch (error) {
      const errorType = error instanceof Error ? error.name : "UnknownError";
      const message = error instanceof Error ? error.message : String(error);
      const result: CliUpgradeResult = {
        ok: false,
        reason: CliUpdateFailureReason.UpgradeFailed,
        guidance: MANUAL_UPDATE_GUIDANCE,
        errorType,
        message,
      };
      this.trackUpgrade(startedAt, targetVersion, result);
      this.logger?.warn("npm package upgrade failed", {
        targetVersion,
        errorType,
      });
      return result;
    }
  }

  private async getGlobalNodeModulesRoot(): Promise<string> {
    const result = (await execFileAsync(NPM_COMMAND, ["root", "-g"], {
      timeout: 5_000,
    })) as unknown;
    const stdout =
      typeof result === "string"
        ? result
        : (result as { readonly stdout: string }).stdout;
    return path.resolve(stdout.trim());
  }

  private findPackageRoots(startPath: string): readonly string[] {
    if (startPath.length === 0) {
      return [];
    }

    const packageRoots: string[] = [];
    for (const candidatePath of this.resolvePackageEntryPointPaths(startPath)) {
      const packageRoot = this.findPackageRootFromCandidate(candidatePath);
      if (packageRoot !== null) {
        packageRoots.push(packageRoot);
      }
    }

    return [...new Set(packageRoots)];
  }

  private findPackageRootFromCandidate(candidatePath: string): string | null {
    if (!fs.existsSync(candidatePath)) {
      return null;
    }

    let current = fs.statSync(candidatePath).isDirectory()
      ? path.resolve(candidatePath)
      : path.dirname(path.resolve(candidatePath));

    while (true) {
      const packageJsonPath = path.join(current, "package.json");
      if (fs.existsSync(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(
            fs.readFileSync(packageJsonPath, "utf-8"),
          ) as { name?: unknown };
          if (packageJson.name === CliPackageName) {
            return current;
          }
        } catch {
          return null;
        }
      }

      const parent = path.dirname(current);
      if (parent === current) {
        return null;
      }
      current = parent;
    }
  }

  private resolvePackageEntryPointPaths(startPath: string): readonly string[] {
    const absoluteStartPath = path.resolve(startPath);
    const candidatePaths = [absoluteStartPath];

    try {
      const realPath = fs.realpathSync(absoluteStartPath);
      if (realPath !== absoluteStartPath) {
        candidatePaths.push(realPath);
      }
    } catch {
      return candidatePaths;
    }

    for (const candidatePath of [...candidatePaths]) {
      const shimTargetPath = this.resolveNpmShimTargetPath(candidatePath);
      if (shimTargetPath !== null) {
        candidatePaths.push(shimTargetPath);
      }
    }

    return [...new Set(candidatePaths)];
  }

  private resolveNpmShimTargetPath(shimPath: string): string | null {
    if (!fs.existsSync(shimPath) || fs.statSync(shimPath).isDirectory()) {
      return null;
    }

    const shimContent = fs.readFileSync(shimPath, "utf-8");
    const packagePathPattern = new RegExp(
      String.raw`(?<target>[^"'\r\n]*node_modules[\\/]${CliPackageName}[\\/]dist[\\/]cli\.js)`,
      "i",
    );
    const match = shimContent.match(packagePathPattern);
    const target = match?.groups?.target;

    if (target === undefined) {
      return null;
    }

    const normalizedTarget = target
      .replace(/%~dp0%?[\\/]?/gi, "")
      .replace(/\$basedir[\\/]?/gi, "");
    return path.resolve(path.dirname(shimPath), normalizedTarget);
  }

  private isInsideDirectory(childPath: string, parentPath: string): boolean {
    const relativePath = path.relative(parentPath, childPath);
    return (
      relativePath.length === 0 ||
      (!relativePath.startsWith("..") && !path.isAbsolute(relativePath))
    );
  }

  private isSourceCheckout(packageRoot: string): boolean {
    return fs.existsSync(path.join(packageRoot, ".git"));
  }

  private unavailable(
    startedAt: number,
    errorType: string,
  ): CliUpgradeFeasibility {
    const result: CliUpgradeFeasibility = {
      feasible: false,
      reason: CliUpdateFailureReason.SelfUpgradeUnavailable,
      guidance: MANUAL_UPDATE_GUIDANCE,
    };
    this.trackFeasibility(startedAt, result, errorType);
    return result;
  }

  private trackFeasibility(
    startedAt: number,
    result: CliUpgradeFeasibility,
    errorType?: string,
  ): void {
    this.telemetryClient?.track(NPM_FEASIBILITY_LOOKUP_COMPLETED_EVENT, {
      feasible: result.feasible,
      durationMs: Date.now() - startedAt,
      ...(result.feasible ? {} : { reason: result.reason }),
      ...(errorType ? { errorType } : {}),
    });
  }

  private trackUpgrade(
    startedAt: number,
    targetVersion: string,
    result: CliUpgradeResult,
  ): void {
    this.telemetryClient?.track(NPM_PACKAGE_UPGRADE_COMPLETED_EVENT, {
      targetVersion,
      success: result.ok,
      durationMs: Date.now() - startedAt,
      ...(result.ok
        ? {}
        : {
            reason: result.reason,
            errorType: result.errorType,
          }),
    });
  }
}
