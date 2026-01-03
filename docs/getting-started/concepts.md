# Core Concepts

Understand the key concepts that power Jumbo.

---

## Sessions

A session represents a continuous period of work with your AI coding agent.

**Starting a session** loads orientation context:

- Project name and purpose
- Previous session summary
- Goals in progress
- Planned goals

**Ending a session** captures what was accomplished, creating continuity for the next session.

```bash
> jumbo session start
# ... work with your AI agent ...
jumbo session end --focus "Completed authentication module"
```

---

## Goals

Goals are discrete units of work. Each goal has:

| Property | Description |
|----------|-------------|
| **Objective** | What needs to be accomplished |
| **Criteria** | How to know when it's done |
| **Scope** | What's in and out of scope |
| **Boundaries** | Non-negotiable constraints |
| **Status** | to-do, doing, blocked, or completed |

When you start a goal, Jumbo delivers a context packet containing everything your AI agent needs to work effectively.

```bash
> jumbo goal add --objective "Add dark mode" --criteria "Toggle works" "Persists preference"
jumbo goal start --goal-id <id>
```

---

## Context packets

Context packets are optimized bundles of project knowledge delivered at workflow transitions.

**Session start packet** contains:

- Project overview
- Recent accomplishments
- Available goals

**Goal start packet** contains:

- Goal objective, criteria, and boundaries
- Relevant components and dependencies
- Applicable invariants and guidelines
- Recent decisions

Context packets are designed for minimal token usage while providing maximum relevance.

---

## Project knowledge

Jumbo captures several types of project knowledge:

| Type | Purpose |
|------|---------|
| **Components** | Parts of your system and their responsibilities |
| **Decisions** | Architectural decisions and their rationale |
| **Invariants** | Non-negotiable rules your code must follow |
| **Guidelines** | Coding standards and best practices |
| **Dependencies** | External systems and libraries |

This knowledge is delivered to your AI agent when relevant to the current goal.

---

## Event store

Jumbo stores all project knowledge as immutable events.

**Benefits:**

- Complete history is preserved
- Nothing is ever lost
- You can trace why decisions were made
- Context is always current

All data is stored locally in `.jumbo/` within your project directory.

---

## The Jumbo workflow

```
┌────────────────────────────────────────────┌─────────────────────────────────────────────────────│
│                Developer                   │                         Agent                       │
┌────────────────────────────────────────────┌─────────────────────────────────────────────────────│
│ 1. goal add     Define objective           │ 1. session start     Load orientation context       │
│        ↓                                   │        ↓                                            │
│ 2. repeat       [Optional] Sstring goals   │ 2. goal start        Load goal context, begin work  │
│        ↓                                   │        ↓                                            │
│ 3. start agent  Jumbo hooks into session   │ 3.   [...]           Agent has context begins work  │
│                                            │        ↓                                            │
│ 4. proceed      Work as normal             │ 4.   [...]           New memories captured          │
│                                            │        ↓                                            │
│                                            │ 5. goal complete     Mark done, capture learnings   │
│                                            │        ↓                                            │
│                                            │ 6. session end       Summarize accomplishments      │
└────────────────────────────────────────────└──────────────────────────────────────────────────────
```

---

## Next steps

- [Goal management guide](../guides/goal-management.md) — Master the goal lifecycle
- [Session management guide](../guides/session-management.md) — Work effectively across sessions
