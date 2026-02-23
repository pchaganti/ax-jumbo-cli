import { RepairMaintenanceRequest } from "./RepairMaintenanceRequest.js";
import { RepairMaintenanceResponse } from "./RepairMaintenanceResponse.js";

export interface IRepairMaintenanceGateway {
  repairMaintenance(request: RepairMaintenanceRequest): Promise<RepairMaintenanceResponse>;
}
