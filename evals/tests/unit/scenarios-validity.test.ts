import { describe, it, expect } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { scoreStructuralAssertions } from '../../src/scoring/structural-assertion-scorer.js';
import { createSessionRecord, createTestScenario } from '../../src/domain/index.js';
import type { SessionRecord, StructuralAssertion, TestScenario } from '../../src/domain/index.js';

function loadScenario(fileName: string): TestScenario {
  return JSON.parse(
    readFileSync(join(process.cwd(), 'scenarios', fileName), 'utf-8'),
  ) as TestScenario;
}

function record(scenarioId: string, sessionNumber: number, files: Record<string, string>): SessionRecord {
  return createSessionRecord({
    id: `rec-${scenarioId}-${sessionNumber}`,
    scenarioId,
    sessionNumber,
    harness: 'claude-code',
    agentOutput: '',
    filesModified: [],
    transcript: '',
    workspaceSnapshot: {
      capturedAt: '2026-03-21T10:05:00Z',
      files: Object.entries(files).map(([path, content]) => ({ path, content })),
    },
    startedAt: '2026-03-21T10:00:00Z',
    completedAt: '2026-03-21T10:05:00Z',
  });
}

/** Constructor-level validation (unique ids, session ranges) must accept both scenarios. */
function validate(scenario: TestScenario): void {
  createTestScenario({
    id: 'validate',
    name: scenario.name,
    initialPrompt: scenario.initialPrompt,
    continuationPrompt: scenario.continuationPrompt,
    sessionCount: scenario.sessionCount,
    expectedFiles: scenario.expectedFiles,
    retentionPatterns: scenario.retentionPatterns,
    structuralAssertions: scenario.structuralAssertions,
    disruptions: scenario.disruptions,
    expectedJumboMemoryCaptures: scenario.expectedJumboMemoryCaptures,
    jumboPlan: scenario.jumboPlan,
  });
}

describe('null-hypothesis-rate-limiter scenario', () => {
  const scenario = loadScenario('null-hypothesis-rate-limiter.json');

  it('is single-session — the property that makes it a null-hypothesis validity check', () => {
    expect(scenario.sessionCount).toBe(1);
    expect(scenario.disruptions ?? []).toHaveLength(0);
    // Every assertion is due in the one and only session.
    for (const a of scenario.structuralAssertions ?? []) {
      expect(a.sessionNumber).toBe(1);
    }
  });

  it('carries the Jumbo prompt asymmetry (a goal) but no pre-seeded memory', () => {
    // The goal handoff keeps the structural prompt difference under test;
    // pre-seeded memory would add an information asymmetry and contaminate the null.
    expect(scenario.jumboPlan?.goals).toHaveLength(1);
    expect(scenario.jumboPlan?.preSeededMemory ?? []).toHaveLength(0);
  });

  it('passes constructor validation', () => {
    expect(() => validate(scenario)).not.toThrow();
  });

  it('is fully satisfied by a correct single-session implementation', () => {
    const files = {
      'src/rate-limiter.ts': 'export interface RateLimiter { tryAcquire(key: string): boolean; }',
      'src/token-bucket.ts': 'export class TokenBucket implements RateLimiter { constructor(private capacity: number, private refillPerSecond: number) {} tryAcquire(key: string) { return this.refill(key); } private refill(k: string) { return true; } }',
      'src/fixed-window.ts': 'export class FixedWindow implements RateLimiter { tryAcquire(key: string) { return true; } }',
      'src/index.ts': "export { TokenBucket } from './token-bucket.js';\nexport { FixedWindow } from './fixed-window.js';\nexport type { RateLimiter } from './rate-limiter.js';",
    };
    const score = scoreStructuralAssertions(
      [record('null-hypothesis', 1, files)],
      scenario.structuralAssertions as readonly StructuralAssertion[],
    );
    expect(score.score).toBe(1);
  });

  it('is unsatisfied by an empty implementation', () => {
    const score = scoreStructuralAssertions(
      [record('null-hypothesis', 1, {})],
      scenario.structuralAssertions as readonly StructuralAssertion[],
    );
    expect(score.score).toBe(0);
  });
});

describe('file-reconstruction-expense-tracker scenario', () => {
  const scenario = loadScenario('file-reconstruction-expense-tracker.json');

  it('is multi-session with decisions legible in files (DECISIONS.md assertions)', () => {
    expect(scenario.sessionCount).toBeGreaterThan(1);
    const decisionLogAssertions = (scenario.structuralAssertions ?? []).filter(
      (a) => a.file === 'DECISIONS.md',
    );
    // The decision log is asserted at the start, after a disruption, and at the end —
    // the in-file recovery path that distinguishes this scenario.
    expect(decisionLogAssertions.length).toBeGreaterThanOrEqual(3);
  });

  it('pre-seeded memory only restates prompt content (no information asymmetry beyond the treatment)', () => {
    // Guard the scenario's core property: both entries must reference what the
    // shared prompt already mandates (layering / decision log), so session 1
    // starts information-symmetric across arms.
    const entries = scenario.jumboPlan?.preSeededMemory ?? [];
    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      const text = JSON.stringify(entry).toLowerCase();
      expect(text.includes('prompt')).toBe(true);
    }
  });

  it('passes constructor validation', () => {
    expect(() => validate(scenario)).not.toThrow();
  });

  it('is fully satisfied by a correct cumulative implementation', () => {
    const domainV1 = 'export interface Expense { id: string; description: string; amount: number; category: string; date: string; }';
    const domainMinorUnits = 'export interface Expense { id: string; description: string; amountMinorUnits: number; category: string; date: string; } // amounts in cents';
    const store = 'export interface ExpenseStore { add(e: Expense): void; list(): Expense[]; }\nexport class MemoryStore implements ExpenseStore { add(e: Expense) {} list() { return []; } }';
    const serviceV1 = 'export class ExpenseService { constructor(private store: ExpenseStore) {} }';
    const serviceAudited = 'export interface AuditEntry { at: string; operation: string; expenseId: string; }\nexport class ExpenseService { private auditLog: AuditEntry[] = []; constructor(private store: ExpenseStore) {} }';
    const decisionsV1 = '# Decisions\n\n2026-01-01: Layered architecture; service depends on the ExpenseStore interface.';
    const decisionsV3 = decisionsV1 + '\n2026-01-02: Store amounts as integer minor units (cents), never floats.';
    const decisionsV5 = decisionsV3 + '\n2026-01-03: Every mutation appends an AuditEntry to the audit log.';

    const records = [
      record('file-recon', 1, {
        'src/domain/expense.ts': domainV1,
        'src/storage/memory-store.ts': store,
        'src/services/expense-service.ts': serviceV1,
        'DECISIONS.md': decisionsV1,
      }),
      record('file-recon', 3, {
        'src/domain/expense.ts': domainMinorUnits,
        'src/storage/memory-store.ts': store,
        'src/services/expense-service.ts': serviceV1,
        'DECISIONS.md': decisionsV3,
      }),
      record('file-recon', 5, {
        'src/domain/expense.ts': domainMinorUnits,
        'src/storage/memory-store.ts': store,
        'src/services/expense-service.ts': serviceAudited,
        'DECISIONS.md': decisionsV5,
      }),
    ];
    const score = scoreStructuralAssertions(
      records,
      scenario.structuralAssertions as readonly StructuralAssertion[],
    );
    expect(score.score).toBe(1);
  });

  it('is unsatisfied by an empty implementation', () => {
    const records = [1, 3, 5].map((s) => record('file-recon', s, {}));
    const score = scoreStructuralAssertions(
      records,
      scenario.structuralAssertions as readonly StructuralAssertion[],
    );
    expect(score.score).toBe(0);
  });
});
