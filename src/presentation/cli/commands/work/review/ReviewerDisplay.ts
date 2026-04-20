/**
 * Reviewer Display
 *
 * Display module for the `jumbo work review` daemon.
 * Extends DaemonDisplay with review-specific labels and
 * outcome-aware completion rendering (approved vs rejected).
 */

import { Colors, Symbols } from "../../../rendering/StyleConfig.js";
import { DaemonDisplay, DaemonRuntimeConfig } from "../shared/DaemonDisplay.js";

export class ReviewerDisplay extends DaemonDisplay {
  constructor(runtimeConfig: DaemonRuntimeConfig) {
    super(
      {
        title: "Jumbo Reviewer",
        idleLabel: "awaiting submissions",
        activeLabel: "reviewing",
        completeStatus: "reviewed",
        daemonName: "Reviewer",
      },
      runtimeConfig,
    );
  }

  /**
   * Render a review outcome with status-specific styling.
   * Approved = green check, Rejected = yellow warning.
   */
  renderReviewOutcome(
    goalId: string,
    objective: string,
    attempts: number,
    outcome: string,
  ): void {
    const sid = this.shortId(goalId);
    const attemptText = `${attempts} attempt${attempts !== 1 ? "s" : ""}`;

    if (outcome === "approved") {
      this.line(
        `  ${Colors.success(Symbols.check)} ${Colors.success("approved")}  ${Colors.bold(sid)}  ${Colors.dim(attemptText)}`,
      );
    } else {
      this.line(
        `  ${Colors.warning(Symbols.warning)} ${Colors.warning("rejected")}  ${Colors.bold(sid)}  ${Colors.dim(attemptText)}`,
      );
    }

    this.line(`  ${Colors.dim(this.truncateObjective(objective))}`);
    this.line("");
  }
}
