/**
 * Tests for goal.refine CLI command
 *
 * Tests the three-mode behavior:
 * 1. Default mode (no flags): Display goal details + LLM prompt, no status change
 * 2. --approve mode: Display goal details + LLM prompt + transition to refined status
 * 3. --interactive mode: Interactive relation flow + transition to refined status
 */

import { describe, it, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { goalRefine } from "../../../../../../src/presentation/cli/commands/goals/refine/goal.refine.js";
import { IApplicationContainer } from "../../../../../../src/application/host/IApplicationContainer.js";
import { GoalView } from "../../../../../../src/application/context/goals/GoalView.js";
import { Renderer } from "../../../../../../src/presentation/cli/rendering/Renderer.js";
import { GoalStatus } from "../../../../../../src/domain/goals/Constants.js";
import { IGoalReader } from "../../../../../../src/application/context/goals/start/IGoalReader.js";

/**
 * Mock implementations for test dependencies
 */

class MockGoalContextReader implements IGoalReader {
  mockFindById: jest.Mock<(goalId: string) => Promise<GoalView | null>> = jest.fn();

  async findById(goalId: string): Promise<GoalView | null> {
    return this.mockFindById(goalId);
  }
}

describe("goal.refine command", () => {
  let mockGoalContextReader: MockGoalContextReader;
  let mockRefineGoalController: { handle: jest.Mock };
  let mockContainer: Partial<IApplicationContainer>;
  let consoleLogSpy: jest.SpiedFunction<typeof console.log>;
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;
  let processExitSpy: jest.SpiedFunction<typeof process.exit>;

  const mockTodoGoalView: GoalView = {
    goalId: "goal_123",
    objective: "Implement user authentication",
    successCriteria: ["Users can log in", "Sessions are persisted"],
    scopeIn: ["Login form", "Session management"],
    scopeOut: ["Password reset", "Social login"],

    status: GoalStatus.TODO,
    version: 1,
    createdAt: "2025-01-01T10:00:00Z",
    updatedAt: "2025-01-01T10:00:00Z",
    progress: [],
  };

  beforeEach(() => {
    // Reset renderer to text mode for testing
    Renderer.configure({ format: "text", verbosity: "normal" });

    // Create mock instances
    mockGoalContextReader = new MockGoalContextReader();
    mockRefineGoalController = {
      handle: jest.fn<() => Promise<any>>().mockResolvedValue({
        goalId: "goal_123",
        status: GoalStatus.REFINED,
      }),
    };

    // Create mock container
    mockContainer = {
      goalContextReader: mockGoalContextReader,
      refineGoalController: mockRefineGoalController as any,
    };

    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    processExitSpy = jest.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`process.exit called with code ${code}`);
    });
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
    Renderer.reset();
  });

  describe("default mode (no flags)", () => {
    it("should display goal details without changing status", async () => {
      mockGoalContextReader.mockFindById.mockResolvedValue(mockTodoGoalView);

      await goalRefine(
        { goalId: "goal_123" },
        mockContainer as IApplicationContainer
      );

      // Verify goal was fetched
      expect(mockGoalContextReader.mockFindById).toHaveBeenCalledWith("goal_123");

      // Verify no controller call (no state transition)
      expect(mockRefineGoalController.handle).not.toHaveBeenCalled();

      // Verify output includes goal details and LLM instructions
      expect(consoleLogSpy).toHaveBeenCalled();
      const allOutput = consoleLogSpy.mock.calls.map((c) => c.join(" ")).join("\n");
      expect(allOutput).toContain("Goal ID:");
      expect(allOutput).toContain("goal_123");
      expect(allOutput).toContain("@LLM:");
      expect(allOutput).toContain("jumbo goal refine --goal-id goal_123 --approve");
    });

    it("should display success criteria when present", async () => {
      mockGoalContextReader.mockFindById.mockResolvedValue(mockTodoGoalView);

      await goalRefine(
        { goalId: "goal_123" },
        mockContainer as IApplicationContainer
      );

      const allOutput = consoleLogSpy.mock.calls.map((c) => c.join(" ")).join("\n");
      expect(allOutput).toContain("Success Criteria");
      expect(allOutput).toContain("Users can log in");
    });

    it("should display scope in and scope out when present", async () => {
      mockGoalContextReader.mockFindById.mockResolvedValue(mockTodoGoalView);

      await goalRefine(
        { goalId: "goal_123" },
        mockContainer as IApplicationContainer
      );

      const allOutput = consoleLogSpy.mock.calls.map((c) => c.join(" ")).join("\n");
      expect(allOutput).toContain("Scope In");
      expect(allOutput).toContain("Login form");
      expect(allOutput).toContain("Scope Out");
      expect(allOutput).toContain("Password reset");
    });

    it("should display LLM refinement prompt with entity exploration commands", async () => {
      mockGoalContextReader.mockFindById.mockResolvedValue(mockTodoGoalView);

      await goalRefine(
        { goalId: "goal_123" },
        mockContainer as IApplicationContainer
      );

      const allOutput = consoleLogSpy.mock.calls.map((c) => c.join(" ")).join("\n");
      expect(allOutput).toContain("jumbo invariants list");
      expect(allOutput).toContain("jumbo guidelines list");
      expect(allOutput).toContain("jumbo decisions list");
      expect(allOutput).toContain("jumbo components list");
    });
  });

  describe("--approve mode", () => {
    it("should transition goal status from to-do to refined via controller", async () => {
      mockGoalContextReader.mockFindById.mockResolvedValue(mockTodoGoalView);

      await goalRefine(
        { goalId: "goal_123", approve: true },
        mockContainer as IApplicationContainer
      );

      // Verify goal was fetched
      expect(mockGoalContextReader.mockFindById).toHaveBeenCalledWith("goal_123");

      // Verify controller was called
      expect(mockRefineGoalController.handle).toHaveBeenCalledWith({ goalId: "goal_123" });

      // Verify success message
      const allOutput = consoleLogSpy.mock.calls.map((c) => c.join(" ")).join("\n");
      expect(allOutput).toContain("Goal refined");
      expect(allOutput).toContain("jumbo goal start");
    });

    it("should display goal details before approving", async () => {
      mockGoalContextReader.mockFindById.mockResolvedValue(mockTodoGoalView);

      await goalRefine(
        { goalId: "goal_123", approve: true },
        mockContainer as IApplicationContainer
      );

      const allOutput = consoleLogSpy.mock.calls.map((c) => c.join(" ")).join("\n");
      expect(allOutput).toContain("Goal Details");
      expect(allOutput).toContain("Objective");
      expect(allOutput).toContain("Implement user authentication");
    });

    it("should display LLM refinement prompt before approving", async () => {
      mockGoalContextReader.mockFindById.mockResolvedValue(mockTodoGoalView);

      await goalRefine(
        { goalId: "goal_123", approve: true },
        mockContainer as IApplicationContainer
      );

      const allOutput = consoleLogSpy.mock.calls.map((c) => c.join(" ")).join("\n");
      expect(allOutput).toContain("@LLM: CRITICAL - Goal refinement requires comprehensive relation registration");
      expect(allOutput).toContain("@LLM: Goal is now refined and ready to start");
    });

    it("should output JSON format when configured", async () => {
      Renderer.configure({ format: "json", verbosity: "normal" });
      mockGoalContextReader.mockFindById.mockResolvedValue(mockTodoGoalView);

      await goalRefine(
        { goalId: "goal_123", approve: true },
        mockContainer as IApplicationContainer
      );

      expect(mockRefineGoalController.handle).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("should exit with error when goal not found", async () => {
      mockGoalContextReader.mockFindById.mockResolvedValue(null);

      await expect(
        goalRefine({ goalId: "nonexistent" }, mockContainer as IApplicationContainer)
      ).rejects.toThrow("process.exit called with code 1");

      // Error messages go to console.error
      const errorOutput = consoleErrorSpy.mock.calls.map((c) => c.join(" ")).join("\n");
      expect(errorOutput).toContain("Goal not found");
    });

    it("should exit with error when controller fails during approve", async () => {
      mockGoalContextReader.mockFindById.mockResolvedValue(mockTodoGoalView);
      mockRefineGoalController.handle.mockRejectedValue(new Error("Goal cannot be refined"));

      await expect(
        goalRefine({ goalId: "goal_123", approve: true }, mockContainer as IApplicationContainer)
      ).rejects.toThrow("process.exit called with code 1");

      // Error messages go to console.error
      const errorOutput = consoleErrorSpy.mock.calls.map((c) => c.join(" ")).join("\n");
      expect(errorOutput).toContain("Failed to refine goal");
    });

    it("should handle goal already in refined status during approve", async () => {
      mockGoalContextReader.mockFindById.mockResolvedValue({
        ...mockTodoGoalView,
        status: GoalStatus.REFINED,
      });
      mockRefineGoalController.handle.mockRejectedValue(
        new Error("Goal is not in TODO status")
      );

      await expect(
        goalRefine({ goalId: "goal_123", approve: true }, mockContainer as IApplicationContainer)
      ).rejects.toThrow("process.exit called with code 1");

      // Error messages go to console.error
      const errorOutput = consoleErrorSpy.mock.calls.map((c) => c.join(" ")).join("\n");
      expect(errorOutput).toContain("Failed to refine goal");
    });
  });

  describe("goal without optional fields", () => {
    it("should handle goal with empty successCriteria", async () => {
      const goalWithoutCriteria: GoalView = {
        ...mockTodoGoalView,
        successCriteria: [],
      };
      mockGoalContextReader.mockFindById.mockResolvedValue(goalWithoutCriteria);

      await goalRefine(
        { goalId: "goal_123" },
        mockContainer as IApplicationContainer
      );

      expect(consoleLogSpy).toHaveBeenCalled();
      // Should not throw and should still display goal details
      const allOutput = consoleLogSpy.mock.calls.map((c) => c.join(" ")).join("\n");
      expect(allOutput).toContain("Goal ID:");
    });

    it("should handle goal with empty scopeIn and scopeOut", async () => {
      const goalWithoutScope: GoalView = {
        ...mockTodoGoalView,
        scopeIn: [],
        scopeOut: [],
      };
      mockGoalContextReader.mockFindById.mockResolvedValue(goalWithoutScope);

      await goalRefine(
        { goalId: "goal_123" },
        mockContainer as IApplicationContainer
      );

      expect(consoleLogSpy).toHaveBeenCalled();
      const allOutput = consoleLogSpy.mock.calls.map((c) => c.join(" ")).join("\n");
      expect(allOutput).toContain("Goal ID:");
      // Scope sections should not appear when empty
      expect(allOutput).not.toContain("Scope In");
      expect(allOutput).not.toContain("Scope Out");
    });
  });
});
