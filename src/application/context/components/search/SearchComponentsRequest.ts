/**
 * SearchComponentsRequest - Request DTO for the search-components use case.
 */

import { ComponentSearchCriteria } from "./ComponentSearchCriteria.js";

export interface SearchComponentsRequest {
  readonly criteria: ComponentSearchCriteria;
}
