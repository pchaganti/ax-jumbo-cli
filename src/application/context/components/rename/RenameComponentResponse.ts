import { ComponentView } from "../ComponentView.js";

export interface RenameComponentResponse {
  readonly componentId: string;
  readonly view: ComponentView | null;
}
