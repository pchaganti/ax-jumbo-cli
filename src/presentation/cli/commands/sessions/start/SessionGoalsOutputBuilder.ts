import { TerminalOutputBuilder } from "../../../output/TerminalOutputBuilder.js";
import { TerminalOutput } from "../../../output/TerminalOutput.js";
import { GoalView } from "../../../../../application/context/goals/GoalView.js";
import { YamlFormatter } from "../../../formatting/YamlFormatter.js";

/**
 * SessionGoalsOutputBuilder - Builds output for session start goal sections.
 *
 * Renders in-progress goals and planned goals for session orientation.
 * Includes the @LLM goal start instruction prompt.
 */
export class SessionGoalsOutputBuilder {
  private readonly builder: TerminalOutputBuilder;
  private readonly yamlFormatter: YamlFormatter;

  constructor() {
    this.builder = new TerminalOutputBuilder();
    this.yamlFormatter = new YamlFormatter();
  }

  /**
   * Build human-readable goals output for session start.
   * Returns in-progress goals block, planned goals block, and goal start instruction.
   */
  buildGoalsOutput(inProgressGoals: GoalView[], plannedGoals: GoalView[]): TerminalOutput {
    this.builder.reset();

    this.builder.addPrompt(this.renderInProgressGoals(inProgressGoals));
    this.builder.addPrompt(this.renderPlannedGoals(plannedGoals));
    this.builder.addPrompt("---\n");
    this.builder.addPrompt(this.renderGoalStartInstruction());

    return this.builder.build();
  }

  /**
   * Build structured goals data for JSON output.
   */
  buildStructuredGoals(inProgressGoals: GoalView[], plannedGoals: GoalView[]): {
    inProgressGoals: Record<string, unknown>;
    plannedGoals: Record<string, unknown>;
    llmGoalStartInstruction: string;
  } {
    return {
      inProgressGoals: this.buildInProgressGoalsData(inProgressGoals),
      plannedGoals: this.buildPlannedGoalsData(plannedGoals),
      llmGoalStartInstruction: this.renderGoalStartInstruction(),
    };
  }

  private renderInProgressGoals(goals: GoalView[]): string {
    const data = this.buildInProgressGoalsData(goals);
    return this.yamlFormatter.toYaml({ inProgressGoals: data });
  }

  private renderPlannedGoals(goals: GoalView[]): string {
    const data = this.buildPlannedGoalsData(goals);
    return this.yamlFormatter.toYaml({ plannedGoals: data });
  }

  renderGoalStartInstruction(): string {
    const llmInstruction = [
      "@LLM: Prompt the user for input about what goal to start. ",
      "For example, \"I can see we've recently worked on X, Y, Z. ",
      "Everything was completed without blockers. Goals A, B, and N ",
      "are planned. Do you want to start with A, or something else?\"",
      "IMPORTANT: Run 'jumbo goal start --id <id>' before doing any work!",
    ];

    return llmInstruction.join("\n");
  }

  private buildInProgressGoalsData(goals: GoalView[]): Record<string, unknown> {
    if (goals.length === 0) {
      return {
        count: 0,
        message:
          "No goals currently in progress. Use 'jumbo goal start --id <id>' to begin working on a goal.",
      };
    }

    return {
      count: goals.length,
      goals: goals.map((g) => ({
        goalId: g.goalId,
        objective: g.objective,
        status: g.status,
        createdAt: g.createdAt,
      })),
    };
  }

  private buildPlannedGoalsData(goals: GoalView[]): Record<string, unknown> {
    if (goals.length === 0) {
      return {
        count: 0,
        message:
          "No planned goals available. Use 'jumbo goal add' to create a new goal to work on.",
      };
    }

    return {
      count: goals.length,
      goals: goals.map((g) => ({
        goalId: g.goalId,
        objective: g.objective,
        status: g.status,
        createdAt: g.createdAt,
      })),
    };
  }
}
