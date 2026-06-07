import type { IApplicationContainer } from "../../../../../application/host/IApplicationContainer.js";
import { Renderer } from "../../../rendering/Renderer.js";
import type { RenderData } from "../../../rendering/types.js";
import { ProjectStatsOutputBuilder } from "./ProjectStatsOutputBuilder.js";

export async function projectStatsCommandHandler(
  _options: Record<string, never>,
  container: IApplicationContainer,
): Promise<void> {
  const renderer = Renderer.getInstance();

  try {
    const response = await container.projectStatsController.handle({
      currentOnly: true,
    });
    const config = renderer.getConfig();
    const outputBuilder = new ProjectStatsOutputBuilder();
    const output =
      config.format === "text"
        ? outputBuilder.build(response.snapshot)
        : outputBuilder.buildStructured(response.snapshot);

    if (config.format === "text") {
      renderer.info(output.toHumanReadable());
      return;
    }

    const dataSection = output.getSections().find((s) => s.type === "data");
    if (dataSection) {
      renderer.data(dataSection.content as RenderData);
    }
  } catch (error) {
    renderer.error(
      "Failed to show project stats",
      error instanceof Error ? error : String(error),
    );
    process.exit(1);
  }
}
