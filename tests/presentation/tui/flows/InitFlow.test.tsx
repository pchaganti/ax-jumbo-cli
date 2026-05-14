import React from "react";
import { describe, expect, it, jest } from "@jest/globals";
import { render } from "ink-testing-library";
import { InitFlow } from "../../../../src/presentation/tui/flows/InitFlow.js";

const tick = () => new Promise((resolve) => setTimeout(resolve, 50));

describe("InitFlow", () => {
  it("renders a non-empty frame on mount", () => {
    const { lastFrame } = render(
      <InitFlow onComplete={() => {}} onCancel={() => {}} />,
    );
    expect((lastFrame() ?? "").length).toBeGreaterThan(0);
  });

  it("advances frame when first step is submitted", async () => {
    const { lastFrame, stdin } = render(
      <InitFlow onComplete={() => {}} onCancel={() => {}} />,
    );
    const before = lastFrame();
    stdin.write("MyProject");
    await tick();
    stdin.write("\r");
    await tick();
    expect(lastFrame()).not.toBe(before);
  });

  it("calls onCancel when escape is pressed", async () => {
    const handleCancel = jest.fn();
    const { stdin } = render(
      <InitFlow onComplete={() => {}} onCancel={handleCancel} />,
    );
    stdin.write("\x1b");
    await tick();
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
});
