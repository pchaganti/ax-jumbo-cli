import { IApplicationContainer } from "../../../../application/host/IApplicationContainer.js";
import { Renderer } from "../../rendering/Renderer.js";
import { CommandMetadata } from "../registry/CommandMetadata.js";
import { EvolveOutputBuilder } from "./EvolveOutputBuilder.js";

export const metadata: CommandMetadata = {
  description: "Update skills, configuration, and database to the current version",
  options: [
    {
      flags: "--yes",
      description: "Skip confirmation prompt",
    },
  ],
  examples: [
    {
      command: "jumbo evolve --yes",
      description: "Update the local Jumbo installation to the current version",
    },
  ],
  related: ["heal", "project init"],
};

interface EvolveOptions {
  yes?: boolean;
}

export async function evolve(options: EvolveOptions, container: IApplicationContainer) {
  const renderer = Renderer.getInstance();
  const outputBuilder = new EvolveOutputBuilder();

  try {
    if (!options.yes) {
      renderer.info(outputBuilder.buildConfirmationRequired().toHumanReadable());
      process.exit(1);
    }

    const response = await container.evolveController.handle();
    renderer.info(outputBuilder.buildSuccess(response.steps).toHumanReadable());
  } catch (error) {
    renderer.info(
      outputBuilder
        .buildFailureError(error instanceof Error ? error : String(error))
        .toHumanReadable()
    );
    process.exit(1);
  }
}
