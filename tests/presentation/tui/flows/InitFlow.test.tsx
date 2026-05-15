import React from "react";
import { describe, expect, it, jest } from "@jest/globals";
import { render } from "ink-testing-library";
import { InitFlow } from "../../../../src/presentation/tui/flows/InitFlow.js";

const tick = () => new Promise((resolve) => setTimeout(resolve, 50));

describe("InitFlow", () => {
  it("renders a non-empty frame on mount", () => {
    const { lastFrame } = render(
      <InitFlow onComplete={() => {}} onCancel={() => {}} />,
    );
    expect((lastFrame() ?? "").length).toBeGreaterThan(0);
  });

  it("advances frame when first step is submitted", async () => {
    const { lastFrame, stdin } = render(
      <InitFlow onComplete={() => {}} onCancel={() => {}} />,
    );
    const before = lastFrame();
    stdin.write("MyProject");
    await tick();
    stdin.write("\r");
    await tick();
    expect(lastFrame()).not.toBe(before);
  });

  it("calls onCancel when escape is pressed", async () => {
    const handleCancel = jest.fn();
    const { stdin } = render(
      <InitFlow onComplete={() => {}} onCancel={handleCancel} />,
    );
    stdin.write("\x1b");
    await tick();
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it("plans, initializes, and persists collected primitives through action controllers", async () => {
    const actionControllers = {
      planProjectInitController: {
        handle: jest.fn().mockResolvedValue({
          availableAgents: [],
          plannedChanges: [],
        }),
      },
      initializeProjectController: {
        handle: jest.fn().mockResolvedValue({
          projectId: "project_123",
          changes: [],
        }),
      },
      addAudienceController: {
        handle: jest.fn().mockResolvedValue({
          audienceId: "aud_123",
          name: "Developers",
          description: "Software developers",
          priority: "primary",
        }),
      },
      addValuePropositionController: {
        handle: jest.fn().mockResolvedValue({
          valuePropositionId: "value_123",
          title: "Persistent context",
        }),
      },
    };
    const handleComplete = jest.fn();

    const { stdin } = render(
      <InitFlow
        actionControllers={actionControllers}
        onComplete={handleComplete}
        onCancel={() => {}}
      />,
    );

    stdin.write("MyProject");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("Project purpose");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("yes");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("Developers");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("Software developers");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("primary");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("no");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("yes");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("Persistent context");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("Keep context across sessions");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("No context loss");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("no");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("yes");
    await tick();
    stdin.write("\r");
    await tick();

    expect(actionControllers.planProjectInitController.handle).toHaveBeenCalledWith({
      projectRoot: process.cwd(),
      selectedAgentIds: undefined,
    });
    expect(actionControllers.initializeProjectController.handle).toHaveBeenCalledWith({
      name: "MyProject",
      purpose: "Project purpose",
      projectRoot: process.cwd(),
      selectedAgentIds: undefined,
    });
    expect(actionControllers.addAudienceController.handle).toHaveBeenCalledWith({
      name: "Developers",
      description: "Software developers",
      priority: "primary",
    });
    expect(
      actionControllers.addValuePropositionController.handle,
    ).toHaveBeenCalledWith({
      title: "Persistent context",
      description: "Keep context across sessions",
      benefit: "No context loss",
      measurableOutcome: undefined,
    });
    expect(handleComplete).toHaveBeenCalledWith(
      expect.objectContaining({ projectId: "project_123" }),
    );
  });

  it("shows dispatch errors inline without closing the flow", async () => {
    const actionControllers = {
      planProjectInitController: {
        handle: jest.fn().mockRejectedValue(new Error("Planning failed")),
      },
    };
    const handleComplete = jest.fn();

    const { lastFrame, stdin } = render(
      <InitFlow
        actionControllers={actionControllers}
        onComplete={handleComplete}
        onCancel={() => {}}
      />,
    );

    stdin.write("MyProject");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("no");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("no");
    await tick();
    stdin.write("\r");
    await tick();

    expect(lastFrame()).toContain("Planning failed");
    expect(handleComplete).not.toHaveBeenCalled();
  });

  it("allows optional audience and value proposition collection to be skipped with enter", async () => {
    const actionControllers = {
      planProjectInitController: {
        handle: jest.fn().mockResolvedValue({
          availableAgents: [],
          plannedChanges: [],
        }),
      },
      initializeProjectController: {
        handle: jest.fn().mockResolvedValue({
          projectId: "project_123",
          changes: [],
        }),
      },
      addAudienceController: {
        handle: jest.fn(),
      },
      addValuePropositionController: {
        handle: jest.fn(),
      },
    };
    const handleComplete = jest.fn();

    const { stdin } = render(
      <InitFlow
        actionControllers={actionControllers}
        onComplete={handleComplete}
        onCancel={() => {}}
      />,
    );

    stdin.write("MyProject");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("\r");
    await tick();

    expect(actionControllers.planProjectInitController.handle).toHaveBeenCalledWith({
      projectRoot: process.cwd(),
      selectedAgentIds: undefined,
    });
    expect(actionControllers.initializeProjectController.handle).toHaveBeenCalledWith({
      name: "MyProject",
      purpose: undefined,
      projectRoot: process.cwd(),
      selectedAgentIds: undefined,
    });
    expect(actionControllers.addAudienceController.handle).not.toHaveBeenCalled();
    expect(
      actionControllers.addValuePropositionController.handle,
    ).not.toHaveBeenCalled();
    expect(handleComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        audienceCount: "0",
        valuePropositionCount: "0",
      }),
    );
  });

  it("defaults empty agent selection to all available agents before initialization", async () => {
    const availableAgents = [
      { id: "claude", name: "Claude" },
      { id: "codex", name: "Codex" },
    ] as const;
    const actionControllers = {
      planProjectInitController: {
        handle: jest.fn().mockResolvedValue({
          availableAgents,
          plannedChanges: [],
        }),
      },
      initializeProjectController: {
        handle: jest.fn().mockResolvedValue({
          projectId: "project_123",
          changes: [],
        }),
      },
    };

    const { stdin } = render(
      <InitFlow
        actionControllers={actionControllers}
        onComplete={() => {}}
        onCancel={() => {}}
      />,
    );

    stdin.write("MyProject");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("\r");
    await tick();

    expect(actionControllers.planProjectInitController.handle).toHaveBeenNthCalledWith(2, {
      projectRoot: process.cwd(),
      selectedAgentIds: ["claude", "codex"],
    });
    expect(actionControllers.initializeProjectController.handle).toHaveBeenCalledWith({
      name: "MyProject",
      purpose: undefined,
      projectRoot: process.cwd(),
      selectedAgentIds: ["claude", "codex"],
    });
  });
});
