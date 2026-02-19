export interface InitializeProjectRequest {
  readonly name: string;
  readonly purpose: string | undefined;
  readonly projectRoot: string;
}
