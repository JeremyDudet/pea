/*
    main agent loop
*/

import { executeTask } from "./execute";

type UserRequest = string;
type AgentResponse = string;

function fetchToolsFromRegistry(): Tool[] {
  return [];
}

async function mainLoop(
  request: UserRequest,
  state: State = {},
  plan?: Plan,
  depth: number = 0,
): Promise<AgentResponse> {
  const MAX_DEPTH = 30;
  if (depth > MAX_DEPTH) {
    return escalateToHuman(request, state);
  }

  // generate plan if non provided
  let currentPlan: Task[] =
    plan ?? generatePlan(interpretRequest(request), fetchToolsFromRegistry());

  if (currentPlan.length === 0) {
    return synthesizeResponse(state);
  }

  // head and tail (slice)
  const [currentTask, ...remainingPlan] = currentPlan;

  try {
    // execute task with single-task agent
    const result = await executeTask(currentTask, state);

    // update state with task result
    const newState = { ...state, [currentTask.id]: result };

    // review result
    const review = reviewTaskResult(currentTask, result, remainingPlan);

    if (review.approved) {
      // recurse with remaining plan and new state
      return mainLoop(request, newState, remainingPlan, depth + 1);
    } else {
      // revise plan based on feedback
      const revisedPlan = revisePlan(
        currentPlan,
        review.feedback ?? "Unspecified issue",
      );

      if (isConfidentInPlan(revisedPlan)) {
        // Recurse with revised plan and current new state (pivot to new plan)
        return mainLoop(request, newState, revisedPlan, depth + 1);
      } else {
        // escalate if not confident
        return escalateToHuman(request, newState);
      }
    }
  } catch (error) {
    // handle error in task execution:  revise plan and recurse if confident, else escalate
    const revisedPlan = handleTaskError(currentPlan, currentTask, error);

    if (isConfidentInPlan(revisedPlan)) {
      return mainLoop(request, state, revisedPlan, depth + 1);
    } else {
      return escalateToHuman(request, state);
    }
  }

  return "";
}
