import type { CommandMetadata } from "../../registry/CommandMetadata.js";
import { projectStatsCommandHandler } from "./projectStatsCommandHandler.js";

const projectStatsMetadata: CommandMetadata = {
  description: "Show current project statistics",
  category: "project-knowledge",
  examples: [
    {
      command: "jumbo project stats",
      description: "Show current project statistics",
    },
    {
      command: "jumbo project stats --format json",
      description: "Show current project statistics as JSON",
    },
  ],
  related: ["project show", "goals list", "relations list"],
  requiresProject: true,
};

export const projectStatsCommand = {
  metadata: projectStatsMetadata,
  handler: projectStatsCommandHandler,
};
