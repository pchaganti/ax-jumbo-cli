import { BaseEvent } from "../../domain/BaseEvent.js";

export interface IEventStore {
  append(event: BaseEvent): Promise<AppendResult>;
  readStream(streamId: string): Promise<BaseEvent[]>;
  getAllEvents(): Promise<BaseEvent[]>;
}

export interface AppendResult {
  nextSeq: number;
}
