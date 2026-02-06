import { ISessionSummaryReader } from "./ISessionSummaryReader.js";
import { IGoalStatusReader } from "../../goals/IGoalStatusReader.js";
import { SessionStartContext } from "./SessionStartContext.js";
import { GoalStatus } from "../../../../domain/work/goals/Constants.js";
import { IProjectContextReader } from "../../../project-knowledge/project/query/IProjectContextReader.js";
import { IAudienceContextReader } from "../../../project-knowledge/audiences/query/IAudienceContextReader.js";
import { IAudiencePainContextReader } from "../../../project-knowledge/audience-pains/query/IAudiencePainContextReader.js";
import { UnprimedBrownfieldQualifier } from "../../../solution/UnprimedBrownfieldQualifier.js";

/**
 * SessionStartContextQueryHandler - Query handler for session start orientation context
 *
 * This query assembles all the data needed for session start context delivery.
 * It follows CQRS principles by:
 * - Living in the application layer (not presentation)
 * - Orchestrating multiple projection stores to build a cohesive view
 * - Returning a complete data model that the presentation layer can render
 *
 * This separates concerns properly:
 * - Application layer: data assembly and business logic
 * - Presentation layer: rendering and user interaction
 */
export class SessionStartContextQueryHandler {
  constructor(
    private readonly sessionSummaryReader: ISessionSummaryReader,
    private readonly goalStatusReader: IGoalStatusReader,
    private readonly projectContextReader?: IProjectContextReader,
    private readonly audienceContextReader?: IAudienceContextReader,
    private readonly audiencePainContextReader?: IAudiencePainContextReader,
    private readonly unprimedBrownfieldQualifier?: UnprimedBrownfieldQualifier
  ) {}

  /**
   * Execute query to assemble complete session start context
   *
   * Assembles:
   * 1. Project context (name, purpose)
   * 2. Target audiences
   * 3. Active audience pains
   * 4. Latest session summary (historical context)
   * 5. In-progress goals (current active work)
   * 6. Planned goals (available work)
   *
   * @returns SessionStartContext with all assembled data
   */
  async execute(): Promise<SessionStartContext> {
    const doingGoals = await this.goalStatusReader.findByStatus(GoalStatus.DOING);
    const pausedGoals = await this.goalStatusReader.findByStatus(GoalStatus.PAUSED);
    const blockedGoals = await this.goalStatusReader.findByStatus(GoalStatus.BLOCKED);

    // Query all projection stores in parallel for efficiency
    const [
      project,
      audiences,
      audiencePains,
      latestSessionSummary,
      plannedGoals,
      isUnprimed,
    ] = await Promise.all([
      this.projectContextReader?.getProject() ?? Promise.resolve(null),
      this.audienceContextReader?.findAllActive() ?? Promise.resolve([]),
      this.audiencePainContextReader?.findAllActive() ?? Promise.resolve([]),
      this.sessionSummaryReader.findLatest(),
      this.goalStatusReader.findByStatus(GoalStatus.TODO),
      this.unprimedBrownfieldQualifier?.isUnprimed() ?? Promise.resolve(false),
    ]);

    const projectContext = project
      ? {
          project,
          audiences,
          audiencePains,
        }
      : null;

    const inProgressGoals = doingGoals.concat(pausedGoals, blockedGoals);

    return {
      projectContext,
      latestSessionSummary,
      inProgressGoals,
      plannedGoals,
      hasSolutionContext: !isUnprimed,
    };
  }
}
