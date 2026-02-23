/**
 * DecisionRecordMapper - Maps infrastructure DecisionRecord to application DecisionView.
 *
 * Handles JSON.parse for array fields and type casting
 * at the infrastructure-application boundary.
 */

import { DecisionView } from "../../../application/context/decisions/DecisionView.js";
import { DecisionRecord } from "./DecisionRecord.js";

export class DecisionRecordMapper {
  toView(record: DecisionRecord): DecisionView {
    return {
      decisionId: record.id,
      title: record.title,
      context: record.context,
      rationale: record.rationale,
      alternatives: JSON.parse(record.alternatives || "[]"),
      consequences: record.consequences,
      status: record.status as DecisionView["status"],
      supersededBy: record.supersededBy,
      reversalReason: record.reversalReason,
      reversedAt: record.reversedAt,
      version: record.version,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
