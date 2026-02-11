# Terminal Output Design Pattern

## Overview

This document describes the builder pattern implementation for composing terminal output across the Jumbo CLI command library.

## Architecture

### Core Abstraction

```
Command (presentation)
  ↓ invokes
CommandHandler (application)
  ↓ returns
ViewData (e.g., GoalContextView)
  ↓ consumed by
TerminalOutputBuilder (presentation)
  ↓ produces
TerminalOutput (format-agnostic)
  ↓ rendered as
String (terminal) | JSON (hooks)
```

### Layer Responsibilities

**Application Layer:**
- Produces universal views (e.g., `GoalContextView`) - command-agnostic
- No knowledge of presentation format or terminal output

**Presentation Layer:**
- Uses builders to compose output from views
- Owns prompt engineering and annotation logic
- Supports multiple output formats (human-readable, JSON for hooks)

## Implementation

### Directory Structure

```
src/presentation/
├── output/                       # Generic output infrastructure
│   ├── Core Types
│   │   ├── SectionType.ts           # prompt | data | annotation | group
│   │   ├── AnnotationType.ts        # emphasis | instruction | warning | context
│   │   ├── Annotation.ts
│   │   ├── Section.ts
│   │   ├── PromptSection.ts
│   │   ├── DataSection.ts
│   │   ├── AnnotationSection.ts
│   │   ├── GroupSection.ts
│   │   ├── HookOutput.ts
│   │   └── index.ts
│   ├── Core Classes
│   │   ├── TerminalOutput.ts        # Format-agnostic output structure
│   │   └── TerminalOutputBuilder.ts # Fluent API for composition
│   └── renderers/
│       ├── EntityRenderer.ts        # Strategy interface
│       ├── EntityRendererRegistry.ts
│       ├── HumanReadableRenderer.ts # Text output for terminal
│       ├── JsonRenderer.ts          # JSON output for hooks
│       ├── InvariantRenderer.ts     # Entity-specific renderers
│       ├── ComponentRenderer.ts
│       ├── GuidelineRenderer.ts
│       ├── DecisionRenderer.ts
│       └── index.ts
└── cli/commands/goals/start/
    ├── goal.start.ts
    ├── GoalContextRenderer.ts       # Existing renderer (to be replaced)
    └── GoalStartOutputBuilder.ts    # Command-specific builder
```

### Key Components

#### 1. TerminalOutput (Format-Agnostic Container)

Holds sections without knowing how they'll be rendered:

```typescript
class TerminalOutput {
  toHumanReadable(): string  // Terminal display
  toJSON(): HookOutput       // Strict JSON for hooks
}
```

#### 2. TerminalOutputBuilder (Fluent API)

Composes output sections:

```typescript
const output = new TerminalOutputBuilder()
  .addPrompt("Opening instructions...")
  .addGroup(invariants, 'invariant', {
    groupHeader: '🔒 Invariants',
    annotation: { type: 'emphasis', text: 'MUST follow' }
  })
  .addPrompt("Closing instructions...")
  .build();
```

#### 3. EntityRenderer (Strategy Pattern)

Type-specific rendering logic:

```typescript
interface EntityRenderer<T> {
  toHumanReadable(entity: T): string
  toJSON(entity: T): unknown
  getDefaultAnnotation?(): Annotation
  getGroupHeader?(): string
}
```

#### 4. Command-Specific Builders

Preserve existing effective prompts:

```typescript
class GoalStartOutputBuilder {
  build(context: GoalContextView): TerminalOutput {
    // Encapsulates goal.start prompt structure
  }
}
```

## Design Decisions

### Universal Views, Not Command-Specific

Application layer returns universal `GoalContextView` (not `StartGoalContextView`).

**Rationale**: Same data, different presentations. Keeps application layer decoupled from presentation concerns.

### Annotations in Presentation Layer

Annotations are prompt engineering directives (emphasis, instructions, warnings).

**Rationale**: How to explain/frame data to users is a presentation concern, not application logic.

### Builder Pattern Over Templates

Composable builders instead of static template files.

**Rationale**:
- Type-safe composition
- Easy to test
- Can still extract patterns from builders later if needed
- Better IDE support

### Dual Output Support

Same structure renders as human-readable text OR strict JSON.

**Rationale**:
- Hook integration requires clean JSON (no stdout pollution)
- Humans need formatted, annotated output
- Builder pattern enables both from same structure

## Usage Patterns

### Example: goal.start Command

```typescript
// Command gets view from handler
const context = await handler.execute(command);

// Build output using command-specific builder
const outputBuilder = new GoalStartOutputBuilder();
const output = outputBuilder.build(context);

// Render based on output mode
if (options.json) {
  console.log(JSON.stringify(output.toJSON()));
} else {
  console.log(output.toHumanReadable());
}
```

### Example: Custom Output Composition

```typescript
const registry = new EntityRendererRegistry();
registry.register('invariant', new InvariantRenderer());
registry.register('component', new ComponentRenderer());

const output = new TerminalOutputBuilder()
  .addPrompt("# Context for Implementation")
  .addGroup(invariants, 'invariant', {
    groupHeader: 'Invariants:',
    annotation: { type: 'emphasis', text: 'MUST adhere' }
  })
  .addGroup(components, 'component', {
    groupHeader: 'Components:',
    annotation: { type: 'context', text: 'Consider these' }
  })
  .build();

const renderer = new HumanReadableRenderer(registry);
console.log(renderer.render(output));
```

## Benefits

1. **Iteration Speed**: Change prompts without touching application logic
2. **Consistency**: Reusable patterns across commands
3. **Testability**: Assert on sections, test renderers independently
4. **Hook Integration**: Same data → clean JSON for hooks
5. **No Stdout Pollution**: Builders never write directly
6. **Extensible**: Add new renderers/formats without changing builders
7. **Type-Safe**: TypeScript enforces structure
8. **Preserves Effective Prompts**: Extract existing patterns, don't reinvent

## Next Steps

1. ✅ Interfaces sketched (Step 2 complete)
2. ⏭️ Prototype with goal.start (Step 3)
3. ⏭️ Verify LLM effectiveness (Step 4)
4. ⏭️ Replicate pattern to other commands

## Related Files

- AUDIT-BACKLOG.md (lines 626-667) - Refactoring plan
- src/presentation/cli/commands/goals/start/GoalContextRenderer.ts - Original pattern
- src/presentation/output/ - New infrastructure
