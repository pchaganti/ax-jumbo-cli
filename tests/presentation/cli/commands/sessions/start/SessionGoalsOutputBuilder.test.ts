/**
 * Tests for SessionGoalsOutputBuilder
 *
 * Verifies output for session start goal sections including:
 * - In-progress goals rendering
 * - Planned goals rendering
 * - Goal start @LLM instruction
 * - Empty goal lists
 * - Structured output for JSON mode
 */

import { describe, it, expect, beforeEach } from "@jest/globals";
import { SessionGoalsOutputBuilder } from "../../../../../../src/presentation/cli/commands/sessions/start/SessionGoalsOutputBuilder.js";
import { GoalView } from "../../../../../../src/application/context/goals/GoalView.js";

describe("SessionGoalsOutputBuilder", () => {
  let builder: SessionGoalsOutputBuilder;

  beforeEach(() => {
    builder = new SessionGoalsOutputBuilder();
  });

  describe("buildGoalsOutput", () => {
    it("should render in-progress goals", () => {
      const inProgress: GoalView[] = [
        { goalId: "g1", objective: "Active task", status: "doing", createdAt: "2025-01-01T10:00:00Z" } as GoalView,
      ];

      const output = builder.buildGoalsOutput(inProgress, []);
      const text = output.toHumanReadable();

      expect(text).toContain("inProgressGoals:");
      expect(text).toContain("goalId: g1");
      expect(text).toContain("objective: Active task");
      expect(text).toContain("count: 1");
    });

    it("should render planned goals", () => {
      const planned: GoalView[] = [
        { goalId: "g2", objective: "Planned task", status: "defined", createdAt: "2025-01-01T10:00:00Z" } as GoalView,
      ];

      const output = builder.buildGoalsOutput([], planned);
      const text = output.toHumanReadable();

      expect(text).toContain("plannedGoals:");
      expect(text).toContain("goalId: g2");
      expect(text).toContain("objective: Planned task");
    });

    it("should show empty message when no in-progress goals", () => {
      const output = builder.buildGoalsOutput([], []);
      const text = output.toHumanReadable();

      expect(text).toContain("No goals currently in progress");
    });

    it("should show empty message when no planned goals", () => {
      const output = builder.buildGoalsOutput([], []);
      const text = output.toHumanReadable();

      expect(text).toContain("No planned goals available");
    });

    it("should include separator and goal start instruction", () => {
      const output = builder.buildGoalsOutput([], []);
      const text = output.toHumanReadable();

      expect(text).toContain("---");
      expect(text).toContain("@LLM:");
      expect(text).toContain("jumbo goal start --id");
    });
  });

  describe("renderGoalStartInstruction", () => {
    it("should contain verbatim @LLM goal start prompt", () => {
      const instruction = builder.renderGoalStartInstruction();

      expect(instruction).toContain("@LLM: Prompt the user for input about what goal to start.");
      expect(instruction).toContain("IMPORTANT: Run 'jumbo goal start --id <id>' before doing any work!");
    });
  });

  describe("buildStructuredGoals", () => {
    it("should return structured data for in-progress and planned goals", () => {
      const inProgress: GoalView[] = [
        { goalId: "g1", objective: "Active", status: "doing", createdAt: "2025-01-01T10:00:00Z" } as GoalView,
      ];
      const planned: GoalView[] = [
        { goalId: "g2", objective: "Planned", status: "defined", createdAt: "2025-01-01T10:00:00Z" } as GoalView,
      ];

      const result = builder.buildStructuredGoals(inProgress, planned);

      expect(result.inProgressGoals).toEqual({
        count: 1,
        goals: [{ goalId: "g1", objective: "Active", status: "doing", createdAt: "2025-01-01T10:00:00Z" }],
      });
      expect(result.plannedGoals).toEqual({
        count: 1,
        goals: [{ goalId: "g2", objective: "Planned", status: "defined", createdAt: "2025-01-01T10:00:00Z" }],
      });
      expect(result.llmGoalStartInstruction).toContain("@LLM:");
    });

    it("should return empty messages when no goals exist", () => {
      const result = builder.buildStructuredGoals([], []);

      expect(result.inProgressGoals).toEqual({
        count: 0,
        message: "No goals currently in progress. Use 'jumbo goal start --id <id>' to begin working on a goal.",
      });
      expect(result.plannedGoals).toEqual({
        count: 0,
        message: "No planned goals available. Use 'jumbo goal add' to create a new goal to work on.",
      });
    });
  });
});
