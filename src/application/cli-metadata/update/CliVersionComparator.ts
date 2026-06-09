import { CliVersionComparison } from "./CliVersionComparison.js";

interface ParsedVersion {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
  readonly prerelease: string | null;
}

const SEMVER_PATTERN =
  /^v?(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)(?:-(?<prerelease>[0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/;

export class CliVersionComparator {
  compare(
    leftVersion: string,
    rightVersion: string,
  ): CliVersionComparison | null {
    const left = this.parse(leftVersion);
    const right = this.parse(rightVersion);

    if (left === null || right === null) {
      return null;
    }

    for (const key of ["major", "minor", "patch"] as const) {
      if (left[key] < right[key]) {
        return CliVersionComparison.Older;
      }
      if (left[key] > right[key]) {
        return CliVersionComparison.Newer;
      }
    }

    if (left.prerelease === right.prerelease) {
      return CliVersionComparison.Equal;
    }
    if (left.prerelease === null) {
      return CliVersionComparison.Newer;
    }
    if (right.prerelease === null) {
      return CliVersionComparison.Older;
    }

    return left.prerelease.localeCompare(right.prerelease) < 0
      ? CliVersionComparison.Older
      : CliVersionComparison.Newer;
  }

  private parse(version: string): ParsedVersion | null {
    const match = version.trim().match(SEMVER_PATTERN);

    if (match?.groups === undefined) {
      return null;
    }

    return {
      major: Number.parseInt(match.groups.major, 10),
      minor: Number.parseInt(match.groups.minor, 10),
      patch: Number.parseInt(match.groups.patch, 10),
      prerelease: match.groups.prerelease ?? null,
    };
  }
}
