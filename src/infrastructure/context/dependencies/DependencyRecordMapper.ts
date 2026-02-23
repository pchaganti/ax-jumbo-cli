/**
 * DependencyRecordMapper - Maps infrastructure DependencyRecord to application DependencyView.
 *
 * Handles type casting at the infrastructure-application boundary.
 */

import { DependencyView } from "../../../application/context/dependencies/DependencyView.js";
import { DependencyStatusType } from "../../../domain/dependencies/Constants.js";
import { DependencyRecord } from "./DependencyRecord.js";

export class DependencyRecordMapper {
  toView(record: DependencyRecord): DependencyView {
    return {
      dependencyId: record.id,
      consumerId: record.consumerId,
      providerId: record.providerId,
      endpoint: record.endpoint,
      contract: record.contract,
      status: record.status as DependencyStatusType,
      version: record.version,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      removedAt: record.removedAt,
      removalReason: record.removalReason,
    };
  }
}
