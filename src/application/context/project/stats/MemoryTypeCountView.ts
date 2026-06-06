export interface MemoryTypeCountView {
  readonly goals: number;
  readonly components: number;
  readonly dependencies: number;
  readonly decisions: number;
  readonly relations: number;
  readonly sessions: number;
  readonly guidelines: number;
  readonly invariants: number;
  readonly blockers: number;
}
