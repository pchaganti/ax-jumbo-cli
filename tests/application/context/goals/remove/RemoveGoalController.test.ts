import { RemoveGoalController } from "../../../../../src/application/context/goals/remove/RemoveGoalController";
import { IRemoveGoalGateway } from "../../../../../src/application/context/goals/remove/IRemoveGoalGateway";

describe("RemoveGoalController", () => {
  let controller: RemoveGoalController;
  let mockGateway: jest.Mocked<IRemoveGoalGateway>;

  beforeEach(() => {
    mockGateway = {
      removeGoal: jest.fn(),
    } as jest.Mocked<IRemoveGoalGateway>;

    controller = new RemoveGoalController(mockGateway);
  });

  it("should delegate to gateway and return response", async () => {
    const request = {
      goalId: "goal_123",
    };

    const expectedResponse = {
      goalId: "goal_123",
      objective: "Remove this goal",
    };

    mockGateway.removeGoal.mockResolvedValue(expectedResponse);

    const response = await controller.handle(request);

    expect(response).toEqual(expectedResponse);
    expect(mockGateway.removeGoal).toHaveBeenCalledWith(request);
  });
});
