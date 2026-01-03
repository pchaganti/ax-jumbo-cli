# Goal Management

Track work effectively with Jumbo's goal system.

---

## Overview

Goals are the heart of Jumbo's context management. When you start a goal, Jumbo delivers a context packet to your AI agent containing:

- The goal's objective, criteria, and boundaries
- Relevant components and dependencies
- Applicable invariants and guidelines
- Recent architectural decisions

---

## Goal lifecycle

```
┌─────────┐     start      ┌─────────┐    complete    ┌───────────┐
│  to-do  │ ─────────────► │  doing  │ ─────────────► │ completed │
└─────────┘                └─────────┘                └───────────┘
     ▲                          │
     │                          │ block
     │ reset                    ▼
     │                     ┌─────────┐
     └──────────────────── │ blocked │
              unblock      └─────────┘
```

| Status | Description |
|--------|-------------|
| `to-do` | Defined but not started |
| `doing` | Currently in progress |
| `blocked` | Impeded by an external factor |
| `completed` | Successfully finished |

---

## Create a goal

### Interactive mode  
<sub>\#for-devs</sub>

Use the guided wizard for complex goals:

```bash
> jumbo goal add --interactive
```

The wizard walks you through:

1. Defining the objective
2. Selecting in-scope components
3. Choosing relevant invariants and guidelines
4. Specifying success criteria
5. Setting boundaries

*Note: If no relevant context is selected all available context will be rendered to the agent when started.*

### Command-line mode  
<sub>\#for-devs-and-agents</sub>

Create a goal directly:

```bash
> jumbo goal add --objective "Implement Rules Engine Pattern for Goal aggregate" --criteria "Validation rules extracted to dedicated rule classes" "Goal aggregate uses rule engine for all validations" "Rules are composable and reusable"
```

### All options

| Option | Description |
|--------|-------------|
| `--objective <text>` | What needs to be accomplished (required) |
| `--criteria <items...>` | Success criteria (can specify multiple) |
| `--scope-in <items...>` | Components in scope |
| `--scope-out <items...>` | Components explicitly out of scope |
| `--boundary <items...>` | Non-negotiable constraints |
| `--interactive` | Use guided wizard |
| `--next-goal <goalId>` | Chain to another goal after completion |
| `--previous-goal <goalId>` | Chain from another goal to this one |

---

## Start a goal 
<sub>\#for-agents \#manual-option</sub>

*NOTE: Agents should do this automatially if the Jumbo workflow is used. It can be useful to utilize Jumbo as a backlog to track your work. If you want to implement a goal manually, this command can be used in parallel without disrupting your agent flow. When ready to work on a goal:*

```bash
> jumbo goal start --goal-id goal_abc123
```

This:

1. Transitions the goal to `doing` status
2. Delivers the goal's context packet to your AI agent
3. Provides guidance for working within scope

Your AI agent receives all relevant project knowledge to begin work immediately.

---

## View goal details
<sub>\#for-devs \#agent-option</sub>

Display complete goal information:

```bash
> jumbo goal show --goal-id goal_abc123
```

Output includes:

- Goal ID and objective
- Current status
- Success criteria
- Scope (in and out)
- Boundaries
- Notes and timestamps

---

## Update a goal
<sub>\#for-agents-and-devs</sub>

Modify goal properties without changing status:

```bash
> jumbo goal update --goal-id goal_abc123 --objective "Updated objective"
```

Update criteria:

```bash
> jumbo goal update --goal-id goal_abc123 --criteria "New criterion 1" "New criterion 2"
```

Update multiple fields:

```bash
> jumbo goal update --goal-id goal_abc123 --objective "New objective" --scope-in "ComponentA"
```

Partial updates are supported—only specified fields change.

---

## Block a goal
<sub>\#for-agents-and-devs</sub>

When progress is impeded:

```bash
> jumbo goal block --goal-id goal_abc123 --note "Waiting for API credentials"
```

The blocker reason is recorded for future reference. This preserves context about why work stopped.

---

## Unblock a goal
<sub>\#for-agents-and-devs</sub>

When the blocker is resolved:

```bash
> jumbo goal unblock --goal-id goal_abc123
```

Add a resolution note:

```bash
> jumbo goal unblock --goal-id goal_abc123 --note "Credentials received from DevOps"
```

The goal returns to `doing` status.

---

## Complete a goal
<sub>\#for-agents-and-devs</sub>

When success criteria are met:

```bash
> jumbo goal complete --goal-id goal_abc123
```

Jumbo prompts your AI agent to reflect on lessons learned and suggest knowledge to capture (invariants, guidelines, decisions).

If the goal is chained to another goal, Jumbo suggests the next goal to start.

---

## Resume a goal
<sub>\#for-agents-and-devs</sub>

Return to an in-progress goal in a new session:

```bash
> jumbo goal resume --goal-id goal_abc123
```

This reloads the goal context without changing status. Use this when:

- Starting a new session with an existing in-progress goal
- Switching between multiple active goals
- Refreshing context after project knowledge changes

> **Note:** `resume` only works for goals in `doing` status. Use `start` for `to-do` goals or `unblock` for `blocked` goals.

---

## Reset a goal
<sub>\#for-agents-and-devs</sub>

Move a goal back to `to-do` status:

```bash
> jumbo goal reset --goal-id goal_abc123
```

Use this to:

- Re-plan a goal that was started prematurely
- Return a completed goal to the backlog

> **Note:** Blocked goals cannot be reset—unblock them first to preserve blocker context.

---

## Remove a goal
<sub>\#for-devs</sub>

Remove a goal from active tracking:

```bash
> jumbo goal remove --goal-id goal_abc123
```

Event history is preserved; only the active view is removed.

---

## Chain goals
<sub>\#for-agents-and-devs</sub>

Link goals in a sequence for multi-step work:

Create a goal that follows another:

```bash
> jumbo goal add --objective "Goal B" --previous-goal goal_abc123
```

When `goal_abc123` completes, Jumbo suggests starting Goal B.

Create a goal that precedes another:

```bash
> jumbo goal add --objective "Goal A" --next-goal goal_xyz789
```

---

## List goals
<sub>\#for-agents-and-devs</sub>

View all active (non-completed) goals:

```bash
> jumbo goals list
```

---

## Best practices

1. **Keep objectives specific**
   "Implement JWT auth" not "Work on authentication"

2. **Define measurable criteria**
   "Tests pass" not "It works"

3. **Set clear boundaries**
   Prevent scope creep before it happens

4. **Use interactive mode for complex goals**
   The wizard helps you select relevant context

5. **Block rather than abandon**
   Preserves blocker context for future sessions

6. **Complete goals explicitly**
   Triggers knowledge capture prompts

---

## Next steps

- [Session management guide](session-management.md) — Manage work sessions
- [Goal command reference](../reference/commands/goal.md) — Complete command details
