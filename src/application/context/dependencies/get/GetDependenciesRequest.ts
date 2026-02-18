import { DependencyListFilter } from "./IDependencyViewReader.js";

export interface GetDependenciesRequest {
  readonly filter?: DependencyListFilter;
}
