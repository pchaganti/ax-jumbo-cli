/**
 * CLI Command: jumbo goal complete
 *
 * Handles goal completion requests.
 * - Without --commit: Triggers QA verification against goal criteria
 * - With --commit: Completes the goal and prompts for learnings
 */

import { CommandMetadata } from "../../../shared/registry/CommandMetadata.js";
import { ApplicationContainer } from "../../../composition/bootstrap.js";
import { Renderer } from "../../../shared/rendering/Renderer.js";
import { CompleteGoalRequest } from "../../../../../application/work/goals/complete/CompleteGoalRequest.js";
import { CompleteGoalResponse } from "../../../../../application/work/goals/complete/CompleteGoalResponse.js";
import { GoalContextFormatter } from "../start/GoalContextFormatter.js";
import { GoalStatus } from "../../../../../domain/work/goals/Constants.js";

/**
 * Command metadata for auto-registration
 */
export const metadata: CommandMetadata = {
  description: "Mark a goal as completed",
  category: "work",
  requiredOptions: [
    {
      flags: "--goal-id <goalId>",
      description: "ID of the goal to complete"
    }
  ],
  examples: [
    {
      command: "jumbo goal complete --goal-id goal_abc123",
      description: "Verify work against goal criteria"
    }
  ],
  related: ["goal add", "goal start", "goal block"]
};

/**
 * Command handler
 * Called by Commander with parsed options
 */
export async function goalComplete(
  options: { goalId: string; commit?: boolean },
  container: ApplicationContainer
) {
  const renderer = Renderer.getInstance();

  try {
    // 1. Get controller from container
    const controller = container.completeGoalController;

    // 2. Create request
    const request: CompleteGoalRequest = {
      goalId: options.goalId,
      commit: options.commit || false,
    };

    // 3. Handle request
    const response = await controller.handle(request);

    // 4. Render response

    // Render LLM prompt
    renderer.info(response.llmPrompt + "\n");
    renderer.info("\n---\n");

 
    switch (response.status) {
      case GoalStatus.DOING:
      case GoalStatus.INREVIEW:
        renderQualityAssuranceContext(renderer, response);
        break;
      case GoalStatus.COMPLETED:
        renderCommittedContext(renderer, response);
        break;
      default:
        break;
    }

  } catch (error) {
    renderer.error("Failed to process goal completion", error instanceof Error ? error : String(error));
    process.exit(1);
  }
}

function renderCommittedContext(
  renderer: Renderer,
  response: CompleteGoalResponse
){
  // Render capture learning prompt
  // If next goal in chain
    if (response.nextGoal) {
    // Render next goal if present
      renderer.success("Next goal in chain:", {
        goalId: response.nextGoal.goalId,
        objective: response.nextGoal.objective,
        status: response.nextGoal.status,
      });
      renderer.info("\nStart this goal. Run:");
      renderer.info(`  jumbo goal start --goal-id ${response.nextGoal.goalId}`);
    }

}

function renderQualityAssuranceContext(
  renderer: Renderer,
  response: CompleteGoalResponse
){
  // Render goal details
  renderer.headline("## Goal Details");
  renderer.data({ goalId: response.goalId, objective: response.objective, status: response.status });
 
  renderer.headline("## Success Criteria");

  // Render goal criteria
  let criteria = response.criteria
  if (criteria) {
    // Render criteria
    if (criteria.goal.successCriteria){
      renderer.headline("### Ensure your work fulfills these explicit criteria:");
      criteria.goal.successCriteria.forEach((element, i) => {
        renderer.data({ [`${i}`] : element});
      });
    }
    // Render files to be changed
    if (criteria.goal.filesToBeChanged){
      renderer.headline("### Ensure your work has changed only these files:");
      criteria.goal.filesToBeChanged.forEach((element, i) => {
        renderer.data({ [`${i}`] : element});
      });
    }
    // Render files to be created
    if (criteria.goal.filesToBeCreated){
      renderer.headline("### Ensure your work has created only these files:");
      criteria.goal.filesToBeCreated.forEach((element, i) => {
        renderer.data({ [`${i}`] : element});
      });
    }
    // Render boundaries
    if (criteria.goal.boundaries.length > 0){
      renderer.headline("### Ensure your work has not exceeded these boundaries:");
      criteria.goal.boundaries.forEach((element, i) => {
        renderer.data({ [`${i}`] : element});
      });
    }
    // Render relevant guidelines
    if (criteria.guidelines){
      renderer.headline("### Ensure your work has followed these guidelines:");
      criteria.guidelines.forEach((element, i) => {
        renderer.data({ [`${i}`] : element.description});
      });
    }
    // Render relevant invariants
    if (criteria.invariants){
      renderer.headline("### Ensure your work does not deviate from these invariants:");
      criteria.invariants.forEach((element, i) => {
        renderer.data({ [`${i}`] : element.description});
      });
    }
    // Render architecture
    if (criteria.goal.architecture && criteria.goal.architecture.description){
          renderer.headline("### Ensure your work fits these architectural details:");
          renderer.data({ 
            description: criteria.goal.architecture.description,
            organization: criteria.goal.architecture.organization, 

          });
          renderer.headline("### Ensure your work follows these architectural patterns:");
          criteria.goal.architecture.patterns?.forEach((element, i) => {
  
            renderer.data({ [`${i}`] : element});
          });
          renderer.headline("### Ensure your work matches these development principles:");
          criteria.goal.architecture.principles?.forEach((element, i) => {
  
            renderer.data({ [`${i}`] : element});
          });
    }
    // Render relevant dependencies
    if (criteria.dependencies.length > 0){
      renderer.headline("### Ensure your work is consistent with these dependencies:");
      criteria.dependencies.forEach(dependency => {
        renderer.data({[`${dependency.name}`] : `Version: ${dependency.version}, Purpose: ${dependency.purpose}.`});
      });
    }
    // Render relevant components
    if (criteria.components.length > 0){
      renderer.headline("### Ensure your work aligns with these components:");
      criteria.components.forEach(component => {
        renderer.data({[`${component.name}`] : `Description: ${component.description}.`});
      });
    }
  }
}
