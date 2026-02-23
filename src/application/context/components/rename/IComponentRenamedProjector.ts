import { ComponentRenamedEvent } from "../../../../domain/components/rename/ComponentRenamedEvent.js";

export interface IComponentRenamedProjector {
  applyComponentRenamed(event: ComponentRenamedEvent): Promise<void>;
}
