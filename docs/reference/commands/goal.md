# Goal Commands Reference

Complete reference for all goal-related commands.

---

## jumbo goal add

Define a new goal.

### Synopsis

```bash
> jumbo goal add --objective <text> [options]
jumbo goal add --interactive
```

### Options

| Option | Description |
|--------|-------------|
| `--objective <text>` | What needs to be accomplished (required unless `--interactive`) |
| `--criteria <items...>` | Success criteria (can specify multiple) |
| `--scope-in <items...>` | Components in scope |
| `--scope-out <items...>` | Components explicitly out of scope |
| `--boundary <items...>` | Non-negotiable constraints |
| `--interactive` | Use guided wizard |
| `--next-goal <goalId>` | Chain to another goal after completion |
| `--previous-goal <goalId>` | Chain from another goal to this one |
| `--files-to-create <files...>` | New files this goal will create |
| `--files-to-change <files...>` | Existing files this goal will modify |

### Examples

Create a goal with guided prompts:

```bash
> jumbo goal add --interactive
```

Add a goal with success criteria:

```bash
> jumbo goal add --objective "Implement JWT auth" --criteria "Token generation" "Token validation"
```

Add a goal with scope defined:

```bash
> jumbo goal add --objective "Refactor UserService" --scope-in UserService AuthMiddleware --scope-out AdminRoutes
```

---

## jumbo goal start

Start working on a goal (transitions from `to-do` to `doing`).

### Synopsis

```bash
> jumbo goal start --goal-id <goalId>
```

### Options

| Option | Description |
|--------|-------------|
| `--goal-id <goalId>` | ID of the goal to start (required) |

### Examples

```bash
> jumbo goal start --goal-id goal_abc123
```

---

## jumbo goal complete

Mark a goal as completed.

### Synopsis

```bash
> jumbo goal complete --goal-id <goalId>
```

### Options

| Option | Description |
|--------|-------------|
| `--goal-id <goalId>` | ID of the goal to complete (required) |

### Examples

```bash
> jumbo goal complete --goal-id goal_abc123
```

---

## jumbo goal block

Mark a goal as blocked with a reason.

### Synopsis

```bash
> jumbo goal block --goal-id <goalId> --note <reason>
```

### Options

| Option | Description |
|--------|-------------|
| `--goal-id <goalId>` | ID of the goal to block (required) |
| `--note <reason>` | Why the goal is blocked (required) |

### Examples

```bash
> jumbo goal block --goal-id goal_abc123 --note "Waiting for API credentials"
```

---

## jumbo goal unblock

Unblock a goal and resume work.

### Synopsis

```bash
> jumbo goal unblock --goal-id <goalId> [--note <resolution>]
```

### Options

| Option | Description |
|--------|-------------|
| `--goal-id <goalId>` | ID of the goal to unblock (required) |
| `--note <resolution>` | How the blocker was resolved (optional) |

### Examples

Unblock a goal:

```bash
> jumbo goal unblock --goal-id goal_abc123
```

Unblock with resolution note:

```bash
> jumbo goal unblock --goal-id goal_abc123 --note "API credentials received"
```

---

## jumbo goal reset

Reset a goal back to `to-do` status.

### Synopsis

```bash
> jumbo goal reset --goal-id <goalId>
```

### Options

| Option | Description |
|--------|-------------|
| `--goal-id <goalId>` | ID of the goal to reset (required) |

### Notes

- Blocked goals cannot be reset (unblock them first)
- Can reset goals in `doing` or `completed` status

### Examples

```bash
> jumbo goal reset --goal-id goal_abc123
```

---

## jumbo goal resume

Resume work on an in-progress goal (loads goal context).

### Synopsis

```bash
> jumbo goal resume --goal-id <goalId>
```

### Options

| Option | Description |
|--------|-------------|
| `--goal-id <goalId>` | ID of the goal to resume (required) |

### Notes

- Only works for goals in `doing` status
- Use `goal start` for `to-do` goals
- Use `goal unblock` for `blocked` goals

### Examples

```bash
> jumbo goal resume --goal-id goal_abc123
```

---

## jumbo goal show

Display full goal details.

### Synopsis

```bash
> jumbo goal show --goal-id <goalId>
```

### Options

| Option | Description |
|--------|-------------|
| `--goal-id <goalId>` | ID of the goal to show (required) |

### Output

Displays:
- Goal ID and objective
- Current status
- Success criteria
- Scope (in and out)
- Boundaries
- Notes and timestamps

### Examples

```bash
> jumbo goal show --goal-id goal_abc123
```

---

## jumbo goal update

Update an existing goal's properties.

### Synopsis

```bash
> jumbo goal update --goal-id <goalId> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--goal-id <goalId>` | ID of the goal to update (required) |
| `--objective <text>` | Updated objective |
| `--criteria <items...>` | Updated success criteria |
| `--scope-in <items...>` | Updated in-scope items |
| `--scope-out <items...>` | Updated out-of-scope items |
| `--boundary <items...>` | Updated boundaries |

### Notes

Partial updates are supported—only specified fields change.

### Examples

Update objective only:

```bash
> jumbo goal update --goal-id goal_abc123 --objective "Updated goal"
```

Update success criteria:

```bash
> jumbo goal update --goal-id goal_abc123 --criteria "Criterion 1" "Criterion 2"
```

Update multiple fields:

```bash
> jumbo goal update --goal-id goal_abc123 --objective "New objective" --scope-in "Component A"
```

---

## jumbo goal remove

Remove a goal from active tracking.

### Synopsis

```bash
> jumbo goal remove --goal-id <goalId>
```

### Options

| Option | Description |
|--------|-------------|
| `--goal-id <goalId>` | ID of the goal to remove (required) |

### Notes

Event history is preserved; only the active view is removed.

### Examples

```bash
> jumbo goal remove --goal-id goal_abc123
```

---

## jumbo goals list

List all active (non-completed) goals.

### Synopsis

```bash
> jumbo goals list
```

### Output

Displays all goals with status `to-do`, `doing`, or `blocked`.

### Examples

```bash
> jumbo goals list
```
