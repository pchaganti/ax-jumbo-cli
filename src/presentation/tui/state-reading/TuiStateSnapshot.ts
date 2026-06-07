export interface TuiStateSnapshot<TData> {
  readonly data: TData | null;
  readonly error: Error | null;
  readonly loading: boolean;
  readonly refresh: () => Promise<void>;
}
