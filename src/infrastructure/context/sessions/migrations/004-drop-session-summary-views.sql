-- Drop orphaned session_summary_views table.
-- SessionSummaryProjection was replaced by query-time assembled SessionContext
-- in the V2 namespace remodel. No code reads or writes this table anymore.

DROP TABLE IF EXISTS session_summary_views;
