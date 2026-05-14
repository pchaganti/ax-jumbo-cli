import React from "react";
import { describe, expect, it } from "@jest/globals";
import { render } from "ink-testing-library";
import { Header } from "../../../../src/presentation/tui/components/Header.js";

describe("Header", () => {
  it("renders the projectName prop value", () => {
    const { lastFrame } = render(
      <Header projectName="MyProject" version="1.2.3" terminalWidth={80} />,
    );
    expect(lastFrame()).toContain("MyProject");
  });

  it("renders the version prop value", () => {
    const { lastFrame } = render(
      <Header projectName="MyProject" version="1.2.3" terminalWidth={80} />,
    );
    expect(lastFrame()).toContain("1.2.3");
  });

});
