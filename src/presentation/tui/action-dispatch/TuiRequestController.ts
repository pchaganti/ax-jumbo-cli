export interface TuiRequestController<TRequest, TResponse> {
  handle(request: TRequest): Promise<TResponse>;
}
