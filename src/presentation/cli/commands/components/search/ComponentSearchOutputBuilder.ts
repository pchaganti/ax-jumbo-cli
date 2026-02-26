/**
 * ComponentSearchOutputBuilder - Presentation layer output builder
 * for the components search command.
 *
 * Handles both TTY text and structured JSON output modes.
 * Supports default (full detail) and compact (id, name, type) formats.
 */

import { TerminalOutputBuilder } from "../../../output/TerminalOutputBuilder.js";
import { TerminalOutput } from "../../../output/TerminalOutput.js";
import { ComponentView } from "../../../../../application/context/components/ComponentView.js";

export type SearchOutputFormat = "default" | "compact";

export class ComponentSearchOutputBuilder {
  private builder: TerminalOutputBuilder;

  constructor() {
    this.builder = new TerminalOutputBuilder();
  }

  /**
   * Build output for TTY (human-readable formatted text).
   */
  build(components: ComponentView[], format: SearchOutputFormat): TerminalOutput {
    this.builder.reset();

    if (components.length === 0) {
      this.builder.addPrompt("No components matched the search criteria.");
      return this.builder.build();
    }

    if (format === "compact") {
      let output = `\nComponents (${components.length}):\n`;
      for (const c of components) {
        output += `\n  ${c.componentId}  ${c.name}  (${c.type})`;
      }
      this.builder.addPrompt(output);
    } else {
      let output = `\nComponents (${components.length}):\n`;
      for (const c of components) {
        output += `\n  ${c.name} (${c.type}) [${c.status}]` +
                  `\n    ${c.description}` +
                  `\n    Path: ${c.path}` +
                  `\n    ID: ${c.componentId}\n`;
      }
      this.builder.addPrompt(output);
    }

    return this.builder.build();
  }

  /**
   * Build output for non-TTY (structured JSON for programmatic consumers).
   */
  buildStructuredOutput(components: ComponentView[], format: SearchOutputFormat): TerminalOutput {
    this.builder.reset();

    if (format === "compact") {
      this.builder.addData({
        count: components.length,
        components: components.map((c) => ({
          componentId: c.componentId,
          name: c.name,
          type: c.type,
        })),
      });
    } else {
      this.builder.addData({
        count: components.length,
        components: components.map((c) => ({
          componentId: c.componentId,
          name: c.name,
          type: c.type,
          description: c.description,
          responsibility: c.responsibility,
          path: c.path,
          status: c.status,
          deprecationReason: c.deprecationReason,
        })),
      });
    }

    return this.builder.build();
  }
}
