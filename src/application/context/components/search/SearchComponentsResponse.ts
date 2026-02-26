/**
 * SearchComponentsResponse - Response DTO for the search-components use case.
 */

import { ComponentView } from "../ComponentView.js";

export interface SearchComponentsResponse {
  readonly components: ComponentView[];
}
