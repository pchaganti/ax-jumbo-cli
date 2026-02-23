import { IEventHandler } from "../../../messaging/IEventHandler.js";
import { BaseEvent } from "../../../../domain/BaseEvent.js";
import { ComponentRenamedEvent } from "../../../../domain/components/rename/ComponentRenamedEvent.js";
import { IComponentRenamedProjector } from "./IComponentRenamedProjector.js";

export class ComponentRenamedEventHandler implements IEventHandler {
  constructor(private readonly projector: IComponentRenamedProjector) {}

  async handle(event: BaseEvent): Promise<void> {
    const componentRenamedEvent = event as ComponentRenamedEvent;
    await this.projector.applyComponentRenamed(componentRenamedEvent);
  }
}
