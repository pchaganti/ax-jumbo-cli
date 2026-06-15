/**
 * Scoring outputs: per-dimension scores, a single-arm test result, and the
 * side-by-side comparison of the Jumbo and baseline arms. Tampered records are
 * folded into the result's tamper provenance.
 */

import type { SessionRecord } from './session.js';
import type { TamperEvent } from './tamper.js';

export interface TestResult {
  readonly id: string;
  readonly scenarioId: string;
  readonly harness: string;
  readonly sessionRecords: readonly SessionRecord[];
  readonly createdAt: string;
  readonly tampered: boolean;
  readonly tamperLog: readonly TamperEvent[];
}

export interface DimensionScore {
  readonly dimension: string;
  readonly score: number;
  readonly maxScore: number;
  readonly details?: string;
}

export interface PerSessionScore {
  readonly sessionNumber: number;
  readonly scores: readonly DimensionScore[];
}

export interface ComparisonResult {
  readonly id: string;
  readonly scenarioId: string;
  readonly harness: string;
  readonly jumboResult: TestResult;
  readonly baselineResult: TestResult;
  readonly jumboScores: readonly DimensionScore[];
  readonly baselineScores: readonly DimensionScore[];
  readonly deltas: readonly DimensionScore[];
  readonly jumboTimeline?: readonly PerSessionScore[];
  readonly baselineTimeline?: readonly PerSessionScore[];
  readonly createdAt: string;
  readonly tampered: boolean;
  readonly tamperLog: readonly TamperEvent[];
}

export function createComparisonResult(params: {
  id: string;
  scenarioId: string;
  harness: string;
  jumboResult: TestResult;
  baselineResult: TestResult;
  jumboScores: readonly DimensionScore[];
  baselineScores: readonly DimensionScore[];
  deltas: readonly DimensionScore[];
  jumboTimeline?: readonly PerSessionScore[];
  baselineTimeline?: readonly PerSessionScore[];
  tampered?: boolean;
  tamperLog?: readonly TamperEvent[];
}): ComparisonResult {
  if (!params.id) throw new Error('ComparisonResult requires an id');
  if (!params.jumboResult) throw new Error('ComparisonResult requires a jumboResult');
  if (!params.baselineResult) throw new Error('ComparisonResult requires a baselineResult');

  const inputTampered = params.tampered ?? false;
  const inputLog = params.tamperLog ?? [];
  const tampered = inputTampered || params.jumboResult.tampered || params.baselineResult.tampered;
  const tamperLog: readonly TamperEvent[] = [
    ...inputLog,
    ...params.jumboResult.tamperLog,
    ...params.baselineResult.tamperLog,
  ];

  return {
    ...params,
    createdAt: new Date().toISOString(),
    tampered,
    tamperLog,
  };
}

export function createTestResult(params: {
  id: string;
  scenarioId: string;
  harness: string;
  sessionRecords: readonly SessionRecord[];
  tampered?: boolean;
  tamperLog?: readonly TamperEvent[];
}): TestResult {
  if (!params.id) throw new Error('TestResult requires an id');
  if (!params.scenarioId) throw new Error('TestResult requires a scenarioId');
  if (!params.harness) throw new Error('TestResult requires a harness');

  const inputTampered = params.tampered ?? false;
  const inputLog = params.tamperLog ?? [];
  const sessionTampered = params.sessionRecords.some((r) => r.tampered);
  const sessionLog = params.sessionRecords.flatMap((r) => r.tamperLog);

  return {
    ...params,
    createdAt: new Date().toISOString(),
    tampered: inputTampered || sessionTampered,
    tamperLog: [...inputLog, ...sessionLog],
  };
}
