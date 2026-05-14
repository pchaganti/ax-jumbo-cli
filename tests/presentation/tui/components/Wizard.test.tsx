import React from "react";
import { describe, expect, it, jest } from "@jest/globals";
import { render } from "ink-testing-library";
import { Wizard } from "../../../../src/presentation/tui/components/Wizard.js";
import type { WizardStepDefinition } from "../../../../src/presentation/tui/components/Wizard.js";

const tick = () => new Promise((resolve) => setTimeout(resolve, 50));

const TWO_STEP_CONFIG: WizardStepDefinition[] = [
  {
    title: "First Step",
    description: "Enter your name",
    fields: [{ key: "name", label: "Name", placeholder: "e.g. Alice" }],
  },
  {
    title: "Second Step",
    fields: [
      { key: "email", label: "Email", placeholder: "e.g. alice@example.com" },
    ],
  },
];

const SINGLE_STEP_CONFIG: WizardStepDefinition[] = [
  {
    title: "Only Step",
    fields: [{ key: "value", label: "Value" }],
  },
];

const MULTI_FIELD_CONFIG: WizardStepDefinition[] = [
  {
    title: "Details",
    fields: [
      { key: "first", label: "First name" },
      { key: "last", label: "Last name" },
    ],
  },
];

describe("Wizard", () => {
  it("renders the wizard title", () => {
    const { lastFrame } = render(
      <Wizard
        title="Test Wizard"
        steps={TWO_STEP_CONFIG}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(lastFrame()).toContain("Test Wizard");
  });

  it("renders step counter", () => {
    const { lastFrame } = render(
      <Wizard
        title="Setup"
        steps={TWO_STEP_CONFIG}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(lastFrame()).toContain("Step 1 of 2");
  });

  it("renders the current step title", () => {
    const { lastFrame } = render(
      <Wizard
        title="Setup"
        steps={TWO_STEP_CONFIG}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(lastFrame()).toContain("First Step");
  });

  it("renders step description when provided", () => {
    const { lastFrame } = render(
      <Wizard
        title="Setup"
        steps={TWO_STEP_CONFIG}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(lastFrame()).toContain("Enter your name");
  });

  it("renders field labels", () => {
    const { lastFrame } = render(
      <Wizard
        title="Setup"
        steps={TWO_STEP_CONFIG}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(lastFrame()).toContain("Name");
  });

  it("renders placeholder text for empty fields", () => {
    const { lastFrame } = render(
      <Wizard
        title="Setup"
        steps={TWO_STEP_CONFIG}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(lastFrame()).toContain("e.g. Alice");
  });

  it("accepts text input into the active field", async () => {
    const { lastFrame, stdin } = render(
      <Wizard
        title="Setup"
        steps={TWO_STEP_CONFIG}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    stdin.write("Hello");
    await tick();
    expect(lastFrame()).toContain("Hello");
  });

  it("shows validation error when advancing with empty required field", async () => {
    const { lastFrame, stdin } = render(
      <Wizard
        title="Setup"
        steps={TWO_STEP_CONFIG}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    stdin.write("\r");
    await tick();
    expect(lastFrame()).toContain("Required");
  });

  it("advances to next step after filling field and pressing enter", async () => {
    const { lastFrame, stdin } = render(
      <Wizard
        title="Setup"
        steps={TWO_STEP_CONFIG}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    stdin.write("Alice");
    await tick();
    stdin.write("\r");
    await tick();
    expect(lastFrame()).toContain("Step 2 of 2");
    expect(lastFrame()).toContain("Second Step");
  });

  it("calls onCancel when escape is pressed", async () => {
    const handleCancel = jest.fn();
    const { stdin } = render(
      <Wizard
        title="Setup"
        steps={TWO_STEP_CONFIG}
        onConfirm={() => {}}
        onCancel={handleCancel}
      />,
    );
    stdin.write("\x1b");
    await tick();
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm with collected values on last step", async () => {
    const handleConfirm = jest.fn();
    const { stdin } = render(
      <Wizard
        title="Setup"
        steps={SINGLE_STEP_CONFIG}
        onConfirm={handleConfirm}
        onCancel={() => {}}
      />,
    );
    stdin.write("test-value");
    await tick();
    stdin.write("\r");
    await tick();
    expect(handleConfirm).toHaveBeenCalledWith({ value: "test-value" });
  });

  it("renders multiple fields in a single step", () => {
    const { lastFrame } = render(
      <Wizard
        title="Setup"
        steps={MULTI_FIELD_CONFIG}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(lastFrame()).toContain("First name");
    expect(lastFrame()).toContain("Last name");
  });

  it("renders navigation hints", () => {
    const { lastFrame } = render(
      <Wizard
        title="Setup"
        steps={TWO_STEP_CONFIG}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(lastFrame()).toContain("esc");
    expect(lastFrame()).toContain("Cancel");
  });

  it("renders a bordered overlay", () => {
    const { lastFrame } = render(
      <Wizard
        title="Setup"
        steps={TWO_STEP_CONFIG}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    const frame = lastFrame()!;
    expect(frame).toContain("╭");
    expect(frame).toContain("╯");
  });

  it("handles backspace to delete characters", async () => {
    const { lastFrame, stdin } = render(
      <Wizard
        title="Setup"
        steps={TWO_STEP_CONFIG}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    stdin.write("Hello");
    await tick();
    stdin.write("\x7f");
    await tick();
    expect(lastFrame()).toContain("Hell");
  });

  it("does not show back hint on first step", () => {
    const { lastFrame } = render(
      <Wizard
        title="Setup"
        steps={TWO_STEP_CONFIG}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(lastFrame()).not.toContain("Back");
  });

  it("shows Confirm label on last step", async () => {
    const { lastFrame, stdin } = render(
      <Wizard
        title="Setup"
        steps={TWO_STEP_CONFIG}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    stdin.write("Alice");
    await tick();
    stdin.write("\r");
    await tick();
    expect(lastFrame()).toContain("Confirm");
  });

  it("moves to next field with tab", async () => {
    const { lastFrame, stdin } = render(
      <Wizard
        title="Setup"
        steps={MULTI_FIELD_CONFIG}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    stdin.write("Alice");
    await tick();
    stdin.write("\t");
    await tick();
    stdin.write("Smith");
    await tick();
    expect(lastFrame()).toContain("Alice");
    expect(lastFrame()).toContain("Smith");
  });

  it("moves to next field with enter when not on last field", async () => {
    const { lastFrame, stdin } = render(
      <Wizard
        title="Setup"
        steps={MULTI_FIELD_CONFIG}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    stdin.write("Alice");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("Smith");
    await tick();
    expect(lastFrame()).toContain("Alice");
    expect(lastFrame()).toContain("Smith");
  });

  it("shows Back hint on second step", async () => {
    const { lastFrame, stdin } = render(
      <Wizard
        title="Setup"
        steps={TWO_STEP_CONFIG}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    stdin.write("Alice");
    await tick();
    stdin.write("\r");
    await tick();
    expect(lastFrame()).toContain("Back");
  });

  it("collects values across multiple steps", async () => {
    const handleConfirm = jest.fn();
    const { stdin } = render(
      <Wizard
        title="Setup"
        steps={TWO_STEP_CONFIG}
        onConfirm={handleConfirm}
        onCancel={() => {}}
      />,
    );
    stdin.write("Alice");
    await tick();
    stdin.write("\r");
    await tick();
    stdin.write("alice@test.com");
    await tick();
    stdin.write("\r");
    await tick();
    expect(handleConfirm).toHaveBeenCalledWith({
      name: "Alice",
      email: "alice@test.com",
    });
  });
});
