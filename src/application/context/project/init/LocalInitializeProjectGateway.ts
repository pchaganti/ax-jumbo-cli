import { IInitializeProjectGateway } from "./IInitializeProjectGateway.js";
import { InitializeProjectRequest } from "./InitializeProjectRequest.js";
import { InitializeProjectResponse } from "./InitializeProjectResponse.js";
import { InitializeProjectCommandHandler } from "./InitializeProjectCommandHandler.js";
import { IPlanProjectInitGateway } from "./IPlanProjectInitGateway.js";

export class LocalInitializeProjectGateway implements IInitializeProjectGateway {
  constructor(
    private readonly commandHandler: InitializeProjectCommandHandler,
    private readonly planProjectInitGateway: IPlanProjectInitGateway
  ) {}

  async initializeProject(request: InitializeProjectRequest): Promise<InitializeProjectResponse> {
    const planResponse = await this.planProjectInitGateway.planProjectInit({
      projectRoot: request.projectRoot,
    });

    const result = await this.commandHandler.execute(
      { name: request.name, purpose: request.purpose },
      request.projectRoot
    );

    return {
      projectId: result.projectId,
      changes: planResponse.plannedChanges,
    };
  }
}
