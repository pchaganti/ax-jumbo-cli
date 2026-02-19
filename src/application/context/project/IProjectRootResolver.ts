export interface IProjectRootResolver {
  resolve(): string;
  resolveOrDefault(): string;
}
