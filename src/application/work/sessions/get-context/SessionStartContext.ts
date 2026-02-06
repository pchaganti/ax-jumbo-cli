import { SessionSummaryProjection } from "../SessionSummaryView.js";
import { GoalView } from "../../goals/GoalView.js";
import { ProjectView } from "../../../project-knowledge/project/ProjectView.js";
import { AudienceView } from "../../../project-knowledge/audiences/AudienceView.js";
import { AudiencePainView } from "../../../project-knowledge/audience-pains/AudiencePainView.js";

/**
 * SessionStartContext - Complete data model for session start orientation
 *
 * This view encapsulates all the data needed to render the session start
 * context packet. It follows CQRS principles by providing a single cohesive
 * read model that the presentation layer can render.
 *
 * The application layer assembles this view from multiple projection stores,
 * keeping the presentation layer free from repository orchestration concerns.
 */
export interface SessionStartContext {
  /**
   * Project context with audiences and pains.
   * Null if project hasn't been initialized.
   */
  readonly projectContext: SessionStartProjectContext | null;

  /**
   * Summary of the most recent session (historical context)
   * Null if this is the first-ever session (brownfield project scenario)
   */
  readonly latestSessionSummary: SessionSummaryProjection | null;

  /**
   * Goals currently being worked on (status='doing'/'paused'/'blocked')
   * Typically should be 0-1 goals in progress
   */
  readonly inProgressGoals: GoalView[];

  /**
   * Goals available to work on next (status='to-do')
   * These are planned but not yet started
   */
  readonly plannedGoals: GoalView[];

  /**
   * Indicates whether the project has any solution context recorded in Jumbo.
   */
  readonly hasSolutionContext: boolean;
}

/**
 * SessionStartProjectContext - Combined project context for session start
 */
export interface SessionStartProjectContext {
  readonly project: ProjectView;
  readonly audiences: AudienceView[];
  readonly audiencePains: AudiencePainView[];
}
