# RFC: Extend `work` for Autonomous Operation

## 1. Summary
This RFC defines a deterministic autonomous workflow for Jumbo using explicit goal transition commands, deterministic worker loops, and lease-based claim lifecycle rules.

The design keeps the current "exception path" commands (`pause`, `block`, `resume`, `unblock`) while establishing a primary happy-path flow for autonomous operation.

## 2. Motivation
Jumbo needs mode-based autonomous operation that is:
- explicit in state changes
- safe under worker crashes and restarts
- auditable from event history
- compatible with existing manual operations

## 3. Scope
In scope:
- goal lifecycle transitions for plan, implement, review, and codify phases
- claim acquisition/release semantics per transition
- work mode loop contracts (`work --plan|--implement|--review|--codify`)
- primary flow vs exceptional flow command model
- migration strategy for existing goal data (state renames, semantic shifts)


## 4. Prerequisites
1. `Goal.prerequisiteGoals -> UUID[]` exists and is enforced where needed.
2. Claim storage supports ownership, lease expiry and is persisted to the data store - not file based.
3. Since .jumbo is not committed to Git (to avoid team conflicts), Claims must be managed by the storage provider.
4. Goal list query can filter by state and claim availability.

## 5. Goals and Non-Goals
Goals:
1. Keep transitions explicit via subcommands (no lifecycle-changing flags on unrelated commands).
2. Ensure claims are acquired and released predictably.
3. Allow autonomous workers to recover from crashes without manual intervention.
4. Existing goals are migrated safely — no user data is lost and no closed work re-enters active backlogs.

## 6. Canonical Goal States

Primary flow:
`DEFINED -> IN_REFINEMENT -> REFINED -> DOING -> SUBMITTED -> IN_REVIEW -> APPROVED -> CODIFYING -> DONE`

Review rejection loop:
`IN_REVIEW -> REJECTED -> DOING` (REJECTED re-enters the implement phase alongside REFINED goals, carrying prior progress and audit findings)

Blocker resolution loop:
`DOING -> BLOCKED -> UNBLOCKED -> DOING` (UNBLOCKED re-enters the implement phase alongside REFINED and REJECTED goals)

Exceptional states:
- `PAUSED` — manual pause during implementation
- `BLOCKED` — awaiting resolution of a dependent goal
- `UNBLOCKED` — blocker resolved, awaiting re-implementation

State class rules:
1. In-progress states: `IN_REFINEMENT`, `DOING`, `IN_REVIEW`, `CODIFYING`
2. Waiting states: `DEFINED`, `REFINED`, `REJECTED`, `UNBLOCKED`, `SUBMITTED`, `APPROVED`, `PAUSED`, `BLOCKED`
3. Terminal state: `DONE`

## 7. Transition Model (Primary Flow)

| Phase | Command | From State | To State | Claim Effect |
|---|---|---|---|---|
| Plan | `jumbo goal add` | n/a | `DEFINED` | none |
| Plan | `jumbo goal refine` | `DEFINED` | `IN_REFINEMENT` | acquire |
| Plan | `jumbo goal commit` | `IN_REFINEMENT` | `REFINED` | release |
| Implement | `jumbo goal start` | `REFINED`, `REJECTED`, `UNBLOCKED` | `DOING` | acquire |
| Implement | `jumbo goal submit` | `DOING` | `SUBMITTED` | release |
| Review | `jumbo goal review` | `SUBMITTED` | `IN_REVIEW` | acquire |
| Review | `jumbo goal approve` | `IN_REVIEW` | `APPROVED` | release |
| Review | `jumbo goal reject` | `IN_REVIEW` | `REJECTED` | release |
| Codify | `jumbo goal codify` | `APPROVED` | `CODIFYING` | acquire |
| Codify | `jumbo goal close` | `CODIFYING` | `DONE` | release |

Notes:
1. Lifecycle transitions are explicit commands.
2. Flags are reserved for behavior modifiers only (example: `--interactive`, `--dry-run`).
3. Entry commands for in-progress states (`refine`, `start`, `review`, `codify`) are idempotent: if the goal is already in the target in-progress state with an expired claim, the command re-acquires the claim. This enables crash recovery without requiring state rollback.
4. Transition commands return deterministic machine-readable errors for invalid source states.

## 8. Exceptional Flow Commands
These remain supported and are intentionally outside the primary autonomous flow.

| Command | Allowed From | Result | Claim Effect |
|---|---|---|---|
| `jumbo goal pause` | `DOING` | `PAUSED` | release |
| `jumbo goal block` | `DOING`, `IN_REVIEW`, `CODIFYING` | `BLOCKED` | release |
| `jumbo goal resume` | `PAUSED` | previous in-progress state | reacquire |
| `jumbo goal unblock` | `BLOCKED` | `UNBLOCKED` | none |
| `jumbo goal reset` | configurable | `DEFINED` or configured target | release |
| `jumbo goal remove` | any | removed | release (if claimed) |

Blocker resolution flow:
1. Worker discovers a blocker on a claimed goal.
2. Worker runs `jumbo goal block --id <goal-id>` to release the claim and park the goal.
3. Worker creates a new goal describing the unblocking objective, linking it via `unblocksGoalId`.
4. The new goal proceeds through the full lifecycle (refine → implement → review).
5. Upon approval, the review worker runs `jumbo goal unblock --id <blocked-goal-id>`, transitioning it to `UNBLOCKED`.
6. An implement worker picks up the `UNBLOCKED` goal through the normal work loop.

## 9. Claim Model
Claims indicate active ownership of in-progress work and avoid conflicts from double work.

Rules:
1. In-progress states (`IN_REFINEMENT`, `DOING`, `IN_REVIEW`, `CODIFYING`) should have an active claim.
2. Terminal or waiting states should not have a claim.
3. If lease expires, another worker may acquire the claim.
4. Default lease TTL is 30 minutes.
5. Any write operation on a claimed goal implicitly renews the lease. No explicit heartbeat is required — active work is the heartbeat.
6. Claim ownership is agent-scoped.
7. Claims use opaque claim tokens, and mutating commands on in-progress states must validate token ownership.
8. Compaction hooks rely on claim lineage: `pre-compact` pauses the active goal by `(workerId, active claim)` and `post-compact` resumes the paused goal by `(workerId, paused claim lineage)`.

## 10. Work Mode Protocols

### `work --plan`
1. Select next goal in `DEFINED` or `IN_REFINEMENT` (expired claim) state, with prerequisite goals at least `REFINED`, ordered by priority then created time.
2. Acquire claim and run `jumbo goal refine --id <goal-id>`.
3. Apply refine-jumbo-goal skill.
4. On completion, run `jumbo goal commit --id <goal-id>` to release claim.

### `work --implement`
1. Select next goal in `REFINED`, `REJECTED`, `UNBLOCKED`, or `DOING` (expired claim) state, with prerequisite goals at least `SUBMITTED`, ordered by priority then created time.
2. Acquire claim with `jumbo goal start --id <goal-id>`.
3. Apply implement-jumbo-goal skill.
4. On completion, run `jumbo goal submit --id <goal-id>` to release claim.

### `work --review`
1. Select next goal in `SUBMITTED` or `IN_REVIEW` (expired claim) state, ordered by submission time then created time.
2. Acquire claim with `jumbo goal review --id <goal-id>`.
3. Audit implementation against criteria/scope/invariants.
4. Apply review-jumbo-goal skill.
5. If qualified, run `jumbo goal approve --id <goal-id>` to release claim.
6. If not qualified, record findings and return goal to implement flow via `jumbo goal reject --id <goal-id> --audit-findings [...]`.
7. If the approved goal has an `unblocksGoalId`, run `jumbo goal unblock --id <unblocks-goal-id>`.

### `work --codify`
1. Select next goal in `APPROVED` or `CODIFYING` (expired claim) state, ordered by approval time then created time.
2. Acquire claim with `jumbo goal codify --id <goal-id>`.
3. Reconcile Jumbo's architectural model — verify components, dependencies, decisions, guidelines, invariants, and relations reflect what was built.
4. Update CHANGELOG with what was delivered.
5. Update any affected documentation.
6. Run `jumbo goal close --id <goal-id>` to release claim.

## 11. Crash Recovery and Idempotency
1. Worker crash during an in-progress phase leaves goal in current in-progress state with a decaying claim.
2. Workers query for both entry states and stale in-progress states (see §10). No cron or read-side state mutation required.
3. New workers may take over after claim lease expiry by re-running the entry command (see §7 note 3).
4. Transition commands must be idempotent:
   - same command retried with same claim token should succeed safely or no-op
   - re-entry into an in-progress state with expired claim should acquire a new claim
   - invalid-state transitions should return deterministic errors
5. Progress updates should support append-only logs to preserve auditability.
6. Compaction flow is command-driven, not lease-heartbeat-driven: workers invoke `work pause` pre-compaction and `work resume` post-compaction using worker-scoped claim lookup.

## 12. Migration Strategy

### Problem
The new lifecycle introduces state renames and a semantic shift that affect existing goal data. The system is event-sourced: the event store is the source of truth and projections (`goal_views`) are derived. Migrating projections alone is insufficient — event replay during projection rebuilds would reproduce old values.

### State changes requiring migration

| Current stored value | Current meaning | New stored value | New meaning |
|---|---|---|---|
| `'to-do'` | Initial state (terminal name: TODO) | `'defined'` | Initial state (DEFINED) |
| `'qualified'` | Passed review (QUALIFIED) | `'approved'` | Passed review (APPROVED) |
| `'completed'` | Terminal — all work finished | `'done'` | Terminal — all work finished (DONE) |

The mid-lifecycle post-implement state (`SUBMITTED`, stored as `'submitted'`) is entirely new and does not conflict with any existing state.

### Approach: Idempotent patch function with GoalStatusMigratedEvent

A one-time idempotent patch function appends a `GoalStatusMigratedEvent` to the event stream of each affected goal. This works *with* the event sourcing model:

1. The patch queries `goal_views` for goals in old status values (`'to-do'`, `'qualified'`, `'completed'`).
2. For each matched goal, it appends a `GoalStatusMigratedEvent`:
   ```
   {
     type: 'GoalStatusMigratedEvent',
     payload: {
       fromStatus: 'completed',
       toStatus: 'done',
       migrationId: 'lifecycle-remodel-v1'
     }
   }
   ```
3. The projection handler updates `goal_views` with the new status, same as any other event.
4. `Goal.apply()` handles `GoalStatusMigratedEvent` by setting `state.status = event.payload.toStatus`.
5. On subsequent replay, the migration event is part of the stream — replay produces the correct final state.

Idempotency: if the patch runs twice, the second run finds zero goals in old status values (the first run already migrated them). No duplicate events are appended.

### GoalCompletedEvent backward compatibility

`GoalCompletedEvent` remains in the event type union and in `Goal.apply()` for replay of pre-migration events. No new code path produces `GoalCompletedEvent` — the `CompleteGoalCommand` is removed. After the patch function runs, every goal that received a `GoalCompletedEvent` also has a subsequent `GoalStatusMigratedEvent` that corrects its status to `'done'`.

### Patch function visibility

The patch function is **not registered in CLI help output**. It is documented in release notes only. This is a one-time operational tool, not a user-facing command.

### Event type summary

| Event | Status | Produced by |
|---|---|---|
| `GoalCompletedEvent` | Retained for replay | No new code path (legacy only) |
| `GoalQualifiedEvent` | Retained for replay | No new code path (legacy only) |
| `GoalSubmittedEvent` | New | `goal submit` command |
| `GoalApprovedEvent` | New | `goal approve` command |
| `GoalStatusMigratedEvent` | New | Patch function only |

Existing events that are unchanged: `GoalAddedEvent`, `GoalRefinedEvent`, `GoalStartedEvent`, `GoalUpdatedEvent`, `GoalBlockedEvent`, `GoalUnblockedEvent`, `GoalPausedEvent`, `GoalResumedEvent`, `GoalResetEvent`, `GoalRemovedEvent`, `GoalProgressUpdatedEvent`, `GoalSubmittedForReviewEvent`.

## 13. Compatibility Matrix

| Area | Current | Proposed | Note |
|---|---|---|---|
| Refinement completion | `goal refine --approve` | `goal commit` | Output needs to be ported |
| Implementation submission | `goal complete` | `goal submit` | New command; `goal complete` removed after patch migrates existing data |
| Review approval | `goal qualify` | `goal approve` | `goal qualify` deprecated with warning |
| Codify completion | flag-based variants | `goal close` | New command |
| Exceptional flow | supported | supported (explicitly non-primary) | Unchanged |

Migration policy:
1. Ship new explicit commands and the patch function in the same release.
2. Announce the patch function in release notes with instructions to run it.
3. Keep `goal qualify` as a deprecated alias emitting a warning.
4. Remove `goal complete` command (no alias — the semantic shift makes an alias misleading).
5. Remove deprecated aliases in a future major version.

## 14. Resolved Questions
1. **Should `resume` reacquire claim directly or only mark goal claimable?**
   `resume` reacquires the claim directly.
2. **What is the exact "not qualified" transition from review?**
   Two outcomes: `jumbo goal approve` transitions to `APPROVED`, or `jumbo goal reject --audit-findings [...]` transitions to `REJECTED`. Implement workers pick from `REJECTED` and `REFINED` goals alike.
3. **What are mandatory artifacts for `codify`?**
   Three responsibilities: (1) reconcile Jumbo's architectural model against what was built, (2) update CHANGELOG, (3) update affected documentation. Episodic memories must be captured during the phase they arise (implement/review), not deferred to codify.
4. **Should dependency satisfaction be strict in every mode or mode-specific?**
   Mode-specific. `work --plan` requires prerequisites at least `REFINED`. `work --implement` requires prerequisites at least `SUBMITTED`. `work --review` and `work --codify` do not enforce prerequisite checks.
5. **What lease TTL and heartbeat interval should be default?**
   30-minute lease TTL. No explicit heartbeat — any write operation on a claimed goal implicitly renews the lease.
6. **Should claim ownership be session-scoped, agent-scoped, or both?**
   Agent-scoped, as it already is.
7. **How should existing goal data be migrated without breaking event replay?**
   An idempotent patch function appends `GoalStatusMigratedEvent` to affected goal event streams. This works with the event sourcing model — replay is safe because the migration events are real events in the stream. See §12 for full details.
8. **What should the mid-lifecycle post-implement state be named?**
   `SUBMITTED` (stored as `'submitted'`). The command is `goal submit`. This avoids the semantic collision where `COMPLETED` would shift from terminal to mid-lifecycle, confusing both human developers and agents. `goal complete` is removed, not aliased, because the semantic shift makes an alias misleading.
9. **Should existing `GoalCompletedEvent` and `GoalQualifiedEvent` be removed?**
   No. Both are retained in the event type union and in `Goal.apply()` for backward-compatible replay of pre-migration event streams. No new code path produces them.

## 15. Scope and Future Work
This RFC is scoped to single-machine, single-user operation: one developer running up to four concurrent terminals (one per work mode). The developer manages git branching and working directory conventions outside of Jumbo. Claims prevent double-assignment; mode separation prevents filesystem contention.

Multi-agent git isolation (per-goal branches, worktrees, cross-machine coordination) is deferred to a future RFC. The claim model and mode-based loops provide a stable foundation to build on.

## 16. Acceptance Criteria
1. Every transition has one explicit command and documented claim effect.
2. Autonomous loops can recover from crashes using lease expiry and worker-side dual-state queries.
3. Primary and exceptional flows are both documented and testable.
4. Alias/deprecation strategy is documented before implementation begins.
5. Codify phase produces reconciled architectural model, updated CHANGELOG, and updated documentation.
6. Patch function migrates all existing goals to new status values without data loss.
7. Event replay produces correct state for both pre-migration and post-migration goals.
8. No historically-completed goal appears in active work mode backlogs after migration.
