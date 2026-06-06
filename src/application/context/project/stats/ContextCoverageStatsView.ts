export interface ContextCoverageStatsView {
  readonly totalRelations: number;
  readonly relationTypesRepresented: number;
  readonly goalsWithContextRelations: number;
  readonly goalsWithoutContextRelations: number;
  readonly goalContextCoverageRatio: number;
}
