import { ComponentView } from "../ComponentView.js";

export interface IComponentRenameReader {
  findById(id: string): Promise<ComponentView | null>;
}
