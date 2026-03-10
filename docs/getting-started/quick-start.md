---
title: Quickstart
description: Get Jumbo working with your AI coding agent in under 2 minutes.
sidebar:
  order: 2
---

# Quickstart

Get Jumbo working with your AI coding agent in under 2 minutes.

---

By the end of this guide, you'll have:

- Initialized Jumbo in your project
- Run your first collaborative session
- Created and started your first goal

---

## Step 1: Initialize your project

Navigate to your project directory and run:

<p style="background: #000000; padding: 15px 15px 15px 15px; font-size:16px; color: #eeeeee; font-family: 'Courier New', Courier, monospace; font-weight:bold">
><span style="color: #f9c741;"> jumbo</span> init
<p>

Follow the interactive prompts to configure your project. Jumbo creates a `.jumbo/` directory containing your project's memory store,  configures agent hooks, and installs jumbo skills. See [What Jumbo creates](what-jumbo-creates.md) for the full list of files.

---

## Step 2: Seed Jumbo

<sub>Example: Claude Code CLI:</sub>
<p style="background: #000000; padding: 15px 15px 15px 15px; font-size:16px; color: #f9c741; font-family: 'Courier New', Courier, monospace; font-weight:bold">
<span style="color: #eeeeee;">></span> claude
<p>

Jumbo hooks into the session and instructs your agent to seed Jumbo with any project knowledge currently known. 


<p style="border-left: #029dea 4px solid; background: #d1effc; padding: 5px 15px 15px 15px; font-size:14px; ">
ℹ️ You might need to run an initial prompt like 'Hi' or 'Follow instructions' to initiate the agent. 
<br><br>
Apologies if this is an annoyance. The agents are instructed to engage Jumbo without prompting and did so until recent versions.
<p>

<p style="border-left: #eade02 4px solid; background: #fbf8c8; padding: 5px 15px 15px 15px; font-size:14px;">
💡<b>Best practice:</b> Archive all of your context related .md files to a location outside of your repository, and strip your AGENTS.md of any special instructions that can be registered with Jumbo. They will cause context bloat and potential conflicting instructions (as your project evolves) if left for agents to read. <i>You can always ask an agent to port them from Jumbo to an .md later if you want to remove Jumbo.</i>
<p>

End your agent session when finished, or clear context and switch to a fresh terminal for Step 3.

---

## Step 3: Create a goal

```bash
> jumbo goal add --title "Add rate limiting" --objective "Add rate limiting middleware to the API" --criteria "Returns 429 with Retry-After header when limit exceeded" "Reads rate limit threshold from app configuration" "Rate limits configurable per route via config" "Bypasses health check and metrics endpoints" "Includes unit tests for limit exceeded scenarios"
```

<p style="background: #000000; padding: 15px 15px 15px 15px; font-size:16px; color: #eeeeee; font-family: 'Courier New', Courier, monospace; font-weight:bold">
><span style="color: #f9c741;"> jumbo</span> goal add <span style="color: #ababab;">--title</span> <span style="color: #00D0E0;">"Add rate limiting"</span> --objective "Add rate limiting middleware to the API" --criteria "Returns 429 with Retry-After header when limit exceeded" "Reads rate limit threshold from app configuration" "Rate limits configurable per route via config" "Bypasses health check and metrics endpoints" "Includes unit tests for limit exceeded scenarios"
<p>

Output:

```
SUCCESS Goal defined
  goalId: goal_01JXXXXXXXXXX
  title: Add rate limiting
  objective: Add rate limiting middleware to the API
  criteria:
    - Returns 429 with Retry-After header when limit exceeded
    - Reads rate limit threshold from app configuration
    - Rate limits configurable per route via config
    - Bypasses health check and metrics endpoints
    - Includes unit tests for limit exceeded scenarios
  status: defined
```

---

## Step 4: Put the agent to work
<p style="border-left: #029dea 4px solid; background: #d1effc; padding: 5px 15px 15px 15px; font-size:14px; ">
ℹ️ These next steps walk you through a straightforward approach to using Jumbo with your agents. Following these steps is beneneficial for understanding the Jumbo workflow when implementing goals. It is recommended to adopt more advanced methods once the basics are understood to achieve higher throughput. Best practices are mentioned throughout, but not necessary for this walkthrough.
<p>

<sub>Example: Claude Code CLI</sub>
```bash
> claude
```

Jumbo hooks into your agent session. The agent should identify your goal and ask what you would like to work on. Following from the previous example, Claude might prompt you with the following:

```bash
> Hey! Session is active. Here's where things stand:

  No goals currently in progress. There is 1 planned goal in the backlog:

  1. Add rate limiting middleware

  Should I start with the planned goal, or do you have something else in mind?
```
### Step 4.a: Refine the goal
Instruct the agent to refine the goal.

```bash
> refine the rate limiting goal
```

The agent will use an installed skill and the context delivered from Jumbo to refine the goal.

When the agent is finished it will run `> jumbo goal commit` marking the goal ready for implementation. You can now clear the agents context window, or restart the agent session, and move on to Step 4.b.

<p style="border-left: #029dea 4px solid; background: #d1effc; padding: 5px 15px 15px 15px; font-size:14px; ">
ℹ️ Goal refinement is a process where the agent queries Jumbo for memories relevant to the objective and criteria of the goal. The agent will register all relations and make the goal ready for  implementing your goal based on the prompt is received from Jumbo. The prompt contains details about your goal and any relevant details that were registered when Jumbo was seeded.
<p>

<p style="border-left: #eade02 4px solid; background: #fbf8c8; padding: 5px 15px 15px 15px; font-size:14px; ">
💡<b>Best practice:</b> Run a single terminal with an agent dedicated to refinement. Clear the context window after refining each goal.
<p>

<p style="border-left: #eade02 4px solid; background: #fbf8c8; padding: 5px 15px 15px 15px; font-size:14px; ">
💡<b>Best practice:</b> The model chosen for this stage should reflect the complexity of the goal - choose accordingly. That said, it is best to use an agent and model that excels at planning and deep thinking. This phase of goal implementation is critical to getting an optimal implementation. The upfront investment in more expensive models will pay dividends. I typically use Claude Code with the most advanced model for this phase.
<p>

---

### Step 4.b: Implement the goal
Start an agent session if the one from the previous session was ended.

Instruct your agent to start your goal when it greets you with an overview of the project and planned goals, like before.

```bash
> start the rate limiting goal
```

The agent will use an installed skill and the context delivered from Jumbo to implement the goal.

When the agent is finished it will run `> jumbo goal submit` marking the goal ready for review. You can now clear the agents context window, or restart the agent session, and move on to Step 4.c.

<p style="border-left: #029dea 4px solid; background: #d1effc; padding: 5px 15px 15px 15px; font-size:14px; ">
ℹ️ <b>Correct the model if it makes mistakes along the way.</b> A mistake is likely the result of a guideline, or invariant, that has not been registered with Jumbo. The agent should capture the correction and propose an addition to Jumbo. These instances typically happen frequently when Jumbo is first added to a project, but fall in frequency over time.
<p>

<p style="border-left: #eade02 4px solid; background: #fbf8c8; padding: 5px 15px 15px 15px; font-size:14px; ">
💡<b>Best practice:</b> Run a single terminal with an agent dedicated to implementation. Clear the context window after implementing each goal. The model chosen for this stage should reflect the complexity of the goal - choose accordingly. Still, it is recommended to use a frontier model, but a second-tier model should save money and yield positive results, if the best practices for refinement are followed. For example, Sonnet 4.6 should perform equally as good as Opus 4.6.
<p>

---

### Step 4.c: Review the goal
Start an agent session if the one from the previous session was ended.

Instruct your agent to review your goal when it greets you with an overview of the project and planned goals, like before.

```bash
> review the rate limiting goal
```

The agent will use an installed skill and the context delivered from Jumbo to review the goal.

If the agent finds no fault with the implementation it will run `> jumbo goal approve` marking the goal ready for codification. There is typically enough context window left (~80%) to continue directly to Step 4.d. If not, clear the agents context window, or restart the agent session, before moving on.

If the agent finds issues with the implementation it will register them with Jumbo, and run `> jumbo goal reject`, putting the goal in the REJECTED state and slating it for another round of implementation. You should now clear the agents context window, or restart the agent session, and repeat Step 4.c.

<p style="border-left: #eade02 4px solid; background: #fbf8c8; padding: 5px 15px 15px 15px; font-size:14px; ">
💡<b>Best practice:</b> Run a single terminal with an agent dedicated to reviewing goals. Clear the context window after reviewing each goal. The model chosen for this stage should reflect the complexity of the goal - choose accordingly.
<p>

---

### Step 4.d: Codify and close the goal

Instruct your agent to proceed codifing your goal.

```bash
> codify the goal
```

The agent will use an installed skill and the context delivered from Jumbo to codify the goal.

During this phase the agent will capture new learnings, review registered entities for staleness, update documentation, then close the goal. 

---

## What's next?

- [What Jumbo creates](what-jumbo-creates.md) — Understand the full project footprint
- [Deep dive into goal management](../guides/goal-management.md) — Learn the full goal lifecycle
- [Project initialization guide](../guides/project-initialization.md) — Configure hooks and capture project knowledge
- [Session management](../guides/session-management.md) — Manage work sessions effectively
