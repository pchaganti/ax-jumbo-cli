import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { RepairMaintenanceController } from "../../../../src/application/maintenance/repair/RepairMaintenanceController.js";
import { IRepairMaintenanceGateway } from "../../../../src/application/maintenance/repair/IRepairMaintenanceGateway.js";
import { RepairMaintenanceResponse } from "../../../../src/application/maintenance/repair/RepairMaintenanceResponse.js";

describe("RepairMaintenanceController", () => {
  let controller: RepairMaintenanceController;
  let mockGateway: jest.Mocked<IRepairMaintenanceGateway>;

  beforeEach(() => {
    mockGateway = {
      repairMaintenance: jest.fn(),
    } as jest.Mocked<IRepairMaintenanceGateway>;

    controller = new RepairMaintenanceController(mockGateway);
  });

  it("should delegate to gateway and return response", async () => {
    const expectedResponse: RepairMaintenanceResponse = {
      steps: [
        { name: "AGENTS.md", status: "repaired" },
        { name: "Agent configurations", status: "repaired" },
        { name: "Settings", status: "repaired" },
        { name: "Database", status: "repaired", detail: "42 events replayed" },
      ],
    };

    mockGateway.repairMaintenance.mockResolvedValue(expectedResponse);

    const response = await controller.handle({
      doAgents: true,
      doSettings: true,
      doDb: true,
    });

    expect(response).toEqual(expectedResponse);
    expect(mockGateway.repairMaintenance).toHaveBeenCalledWith({
      doAgents: true,
      doSettings: true,
      doDb: true,
    });
  });

  it("should pass skip flags through to gateway", async () => {
    mockGateway.repairMaintenance.mockResolvedValue({ steps: [] });

    await controller.handle({
      doAgents: false,
      doSettings: false,
      doDb: false,
    });

    expect(mockGateway.repairMaintenance).toHaveBeenCalledWith({
      doAgents: false,
      doSettings: false,
      doDb: false,
    });
  });
});
