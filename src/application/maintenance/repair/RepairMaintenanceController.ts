import { RepairMaintenanceRequest } from "./RepairMaintenanceRequest.js";
import { RepairMaintenanceResponse } from "./RepairMaintenanceResponse.js";
import { IRepairMaintenanceGateway } from "./IRepairMaintenanceGateway.js";

export class RepairMaintenanceController {
  constructor(
    private readonly gateway: IRepairMaintenanceGateway
  ) {}

  async handle(request: RepairMaintenanceRequest): Promise<RepairMaintenanceResponse> {
    return this.gateway.repairMaintenance(request);
  }
}
