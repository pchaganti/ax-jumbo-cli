/**
 * Tests for SessionStartOutputBuilder
 *
 * Verifies the top-level session start output composition:
 * - Human-readable output includes all context and goal sections
 * - Structured output contains all expected fields
 * - @LLM prompts are preserved in both modes
 */

import { describe, it, expect, beforeEach } from "@jest/globals";
import { SessionStartOutputBuilder } from "../../../../../../src/presentation/cli/commands/sessions/start/SessionStartOutputBuilder.js";
import { EnrichedSessionContext } from "../../../../../../src/application/context/sessions/get/EnrichedSessionContext.js";
import { SessionContext } from "../../../../../../src/application/context/sessions/get/SessionContext.js";
import { GoalView } from "../../../../../../src/application/context/goals/GoalView.js";
import { DecisionView } from "../../../../../../src/application/context/decisions/DecisionView.js";
import { SessionView } from "../../../../../../src/application/context/sessions/SessionView.js";

describe("SessionStartOutputBuilder", () => {
  let builder: SessionStartOutputBuilder;

  beforeEach(() => {
    builder = new SessionStartOutputBuilder();
  });

  const defaultSession: SessionView = {
    sessionId: "session-1",
    status: "active",
    focus: "Test session",
    contextSnapshot: null,
    version: 1,
    startedAt: "2025-01-01T10:00:00Z",
    endedAt: null,
    createdAt: "2025-01-01T10:00:00Z",
    updatedAt: "2025-01-01T10:00:00Z",
  };

  function createContext(
    contextOverrides: Partial<SessionContext> = {},
    session: SessionView | null = defaultSession,
    instructions: string[] = []
  ): EnrichedSessionContext {
    return {
      session,
      context: {
        projectContext: null,
        activeGoals: [],
        pausedGoals: [],
        plannedGoals: [],
        recentDecisions: [],
        deactivatedRelations: { count: 0, summary: "No deactivated relations." },
        ...contextOverrides,
      },
      instructions,
      scope: "session-start",
    };
  }

  describe("buildSessionStartOutput", () => {
    it("should include session context in output", () => {
      const context = createContext();
      const output = builder.buildSessionStartOutput(context);
      const text = output.toHumanReadable();

      expect(text).toContain("status: active");
    });

    it("should include in-progress and planned goals", () => {
      const context = createContext({
        activeGoals: [{ goalId: "g1", objective: "Active task", status: "doing" } as GoalView],
        plannedGoals: [{ goalId: "g2", objective: "Planned task", status: "defined" } as GoalView],
      });

      const output = builder.buildSessionStartOutput(context);
      const text = output.toHumanReadable();

      expect(text).toContain("inProgressGoals:");
      expect(text).toContain("goalId: g1");
      expect(text).toContain("plannedGoals:");
      expect(text).toContain("goalId: g2");
    });

    it("should include @LLM goal start instruction", () => {
      const context = createContext();
      const output = builder.buildSessionStartOutput(context);
      const text = output.toHumanReadable();

      expect(text).toContain("@LLM:");
      expect(text).toContain("jumbo goal start --id");
    });

    it("should include paused goals resume prompt when goals are paused", () => {
      const context = createContext({
        pausedGoals: [
          { goalId: "g_paused", objective: "Paused work", status: "paused", updatedAt: "2025-01-01T11:00:00Z" } as GoalView,
        ],
      });

      const output = builder.buildSessionStartOutput(context);
      const text = output.toHumanReadable();

      expect(text).toContain("Goals were paused");
      expect(text).toContain("jumbo goal resume --id");
    });

    it("should include brownfield instruction when brownfield-onboarding present", () => {
      const context = createContext({}, defaultSession, ["brownfield-onboarding"]);
      const output = builder.buildSessionStartOutput(context);
      const text = output.toHumanReadable();

      expect(text).toContain("BROWNFIELD PROJECT");
    });

    it("should combine active and paused goals as in-progress", () => {
      const context = createContext({
        activeGoals: [{ goalId: "g_active", objective: "Active", status: "doing" } as GoalView],
        pausedGoals: [{ goalId: "g_paused", objective: "Paused", status: "paused", updatedAt: "2025-01-01T11:00:00Z" } as GoalView],
      });

      const output = builder.buildSessionStartOutput(context);
      const text = output.toHumanReadable();

      expect(text).toContain("count: 2");
      expect(text).toContain("goalId: g_active");
      expect(text).toContain("goalId: g_paused");
    });
  });

  describe("buildStructuredOutput", () => {
    it("should include all expected top-level fields", () => {
      const context = createContext();
      const result = builder.buildStructuredOutput(context, "session-123");

      expect(result).toHaveProperty("projectContext");
      expect(result).toHaveProperty("sessionContext");
      expect(result).toHaveProperty("inProgressGoals");
      expect(result).toHaveProperty("plannedGoals");
      expect(result).toHaveProperty("llmInstructions");
      expect(result).toHaveProperty("sessionStart");
    });

    it("should include session ID in sessionStart field", () => {
      const context = createContext();
      const result = builder.buildStructuredOutput(context, "session-456");

      expect(result.sessionStart).toEqual({ sessionId: "session-456" });
    });

    it("should include llm instructions with session context and goal start", () => {
      const context = createContext({
        pausedGoals: [
          { goalId: "g1", objective: "Paused", status: "paused", updatedAt: "2025-01-01T11:00:00Z" } as GoalView,
        ],
      });

      const result = builder.buildStructuredOutput(context, "session-789");
      const llm = result.llmInstructions as Record<string, unknown>;

      expect(llm.sessionContext).toContain("Goals were paused");
      expect(llm.goalStart).toContain("@LLM:");
    });

    it("should have null sessionContext instruction when no paused goals", () => {
      const context = createContext();
      const result = builder.buildStructuredOutput(context, "session-000");
      const llm = result.llmInstructions as Record<string, unknown>;

      expect(llm.sessionContext).toBeNull();
    });
  });
});
