import type { ProjectStatsSnapshotView } from "../../../../../application/context/project/stats/ProjectStatsSnapshotView.js";
import { TerminalOutput } from "../../../output/TerminalOutput.js";
import { TerminalOutputBuilder } from "../../../output/TerminalOutputBuilder.js";

export class ProjectStatsOutputBuilder {
  private readonly builder = new TerminalOutputBuilder();

  build(snapshot: ProjectStatsSnapshotView): TerminalOutput {
    this.builder.reset();
    this.builder.addPrompt(this.toText(snapshot));
    return this.builder.build();
  }

  buildStructured(snapshot: ProjectStatsSnapshotView): TerminalOutput {
    this.builder.reset();
    this.builder.addData({ projectStats: this.toData(snapshot) });
    return this.builder.build();
  }

  private toData(snapshot: ProjectStatsSnapshotView): Record<string, unknown> {
    return {
      memoryCounts: snapshot.memoryCounts,
      goalFlow: snapshot.goalFlow,
      contextCoverage: snapshot.contextCoverage,
    };
  }

  private toText(snapshot: ProjectStatsSnapshotView): string {
    const coveragePercent = Math.round(
      snapshot.contextCoverage.goalContextCoverageRatio * 100,
    );
    const statusLine = snapshot.goalFlow.byStatus
      .map((statusCount) => `${statusCount.status}: ${statusCount.count}`)
      .join(", ");

    return [
      "Project Stats",
      "",
      "Memory",
      `  Goals: ${snapshot.memoryCounts.goals}`,
      `  Components: ${snapshot.memoryCounts.components}`,
      `  Dependencies: ${snapshot.memoryCounts.dependencies}`,
      `  Decisions: ${snapshot.memoryCounts.decisions}`,
      `  Relations: ${snapshot.memoryCounts.relations}`,
      `  Sessions: ${snapshot.memoryCounts.sessions}`,
      `  Guidelines: ${snapshot.memoryCounts.guidelines}`,
      `  Invariants: ${snapshot.memoryCounts.invariants}`,
      `  Blockers: ${snapshot.memoryCounts.blockers}`,
      "",
      "Goal Flow",
      `  By status: ${statusLine.length === 0 ? "none" : statusLine}`,
      `  Refined ready: ${snapshot.goalFlow.refinedGoalsReady}`,
      `  Active blockers: ${snapshot.goalFlow.activeBlockers}`,
      "",
      "Context Coverage",
      `  Total relations: ${snapshot.contextCoverage.totalRelations}`,
      `  Relation types: ${snapshot.contextCoverage.relationTypesRepresented}`,
      `  Goals with context relations: ${snapshot.contextCoverage.goalsWithContextRelations}`,
      `  Goals without context relations: ${snapshot.contextCoverage.goalsWithoutContextRelations}`,
      `  Goal context coverage: ${coveragePercent}%`,
    ].join("\n");
  }
}
