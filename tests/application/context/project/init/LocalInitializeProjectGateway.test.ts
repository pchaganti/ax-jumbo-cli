import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { LocalInitializeProjectGateway } from "../../../../../src/application/context/project/init/LocalInitializeProjectGateway.js";
import { InitializeProjectCommandHandler } from "../../../../../src/application/context/project/init/InitializeProjectCommandHandler.js";
import { IPlanProjectInitGateway } from "../../../../../src/application/context/project/init/IPlanProjectInitGateway.js";
import { InitializeProjectRequest } from "../../../../../src/application/context/project/init/InitializeProjectRequest.js";
import { PlannedFileChange } from "../../../../../src/application/context/project/init/PlannedFileChange.js";

describe("LocalInitializeProjectGateway", () => {
  let gateway: LocalInitializeProjectGateway;
  let mockCommandHandler: jest.Mocked<InitializeProjectCommandHandler>;
  let mockPlanGateway: jest.Mocked<IPlanProjectInitGateway>;

  beforeEach(() => {
    mockCommandHandler = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<InitializeProjectCommandHandler>;

    mockPlanGateway = {
      planProjectInit: jest.fn(),
    } as jest.Mocked<IPlanProjectInitGateway>;

    gateway = new LocalInitializeProjectGateway(mockCommandHandler, mockPlanGateway);
  });

  it("should get planned changes, execute command, and assemble response", async () => {
    const request: InitializeProjectRequest = {
      name: "my-project",
      purpose: "A test project",
      projectRoot: "/home/user/project",
    };

    const plannedChanges: PlannedFileChange[] = [
      { path: "AGENTS.md", action: "create", description: "Agent instructions" },
      { path: ".claude/settings.json", action: "create", description: "CLI settings" },
    ];

    mockPlanGateway.planProjectInit.mockResolvedValue({
      plannedChanges,
    });

    mockCommandHandler.execute.mockResolvedValue({
      projectId: "project",
    });

    const response = await gateway.initializeProject(request);

    expect(response.projectId).toBe("project");
    expect(response.changes).toEqual(plannedChanges);
  });

  it("should call planProjectInit with projectRoot from request", async () => {
    const request: InitializeProjectRequest = {
      name: "my-project",
      purpose: undefined,
      projectRoot: "/home/user/project",
    };

    mockPlanGateway.planProjectInit.mockResolvedValue({ plannedChanges: [] });
    mockCommandHandler.execute.mockResolvedValue({ projectId: "project" });

    await gateway.initializeProject(request);

    expect(mockPlanGateway.planProjectInit).toHaveBeenCalledWith({
      projectRoot: "/home/user/project",
    });
  });

  it("should build command from request and pass projectRoot to handler", async () => {
    const request: InitializeProjectRequest = {
      name: "my-project",
      purpose: "Build great things",
      projectRoot: "/home/user/project",
    };

    mockPlanGateway.planProjectInit.mockResolvedValue({ plannedChanges: [] });
    mockCommandHandler.execute.mockResolvedValue({ projectId: "project" });

    await gateway.initializeProject(request);

    expect(mockCommandHandler.execute).toHaveBeenCalledWith(
      { name: "my-project", purpose: "Build great things" },
      "/home/user/project"
    );
  });

  it("should pass undefined purpose to command handler when not provided", async () => {
    const request: InitializeProjectRequest = {
      name: "minimal-project",
      purpose: undefined,
      projectRoot: "/home/user/minimal",
    };

    mockPlanGateway.planProjectInit.mockResolvedValue({ plannedChanges: [] });
    mockCommandHandler.execute.mockResolvedValue({ projectId: "project" });

    await gateway.initializeProject(request);

    expect(mockCommandHandler.execute).toHaveBeenCalledWith(
      { name: "minimal-project", purpose: undefined },
      "/home/user/minimal"
    );
  });
});
