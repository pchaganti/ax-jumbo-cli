/**
 * Goal Status Query
 *
 * Subprocess-based helper to query the current status of a goal.
 * Used by work daemons to check whether an agent subprocess
 * successfully transitioned a goal to the expected state.
 */

import { execSync } from "node:child_process";

/**
 * Query the current status of a goal via a short-lived subprocess.
 * Returns the status string, or "unknown" on failure.
 */
export function queryGoalStatus(goalId: string): string {
  try {
    const stdout = execSync(`npx jumbo goal show --id ${goalId}`, {
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 30_000,
    }).toString();
    const parsed = JSON.parse(stdout);
    return parsed.status ?? parsed.goal?.status ?? "unknown";
  } catch {
    return "unknown";
  }
}
