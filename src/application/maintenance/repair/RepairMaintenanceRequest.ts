export interface RepairMaintenanceRequest {
  readonly doAgents: boolean;
  readonly doSettings: boolean;
  readonly doDb: boolean;
}
