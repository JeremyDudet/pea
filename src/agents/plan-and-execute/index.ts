/*
  src/agents/planAndExecute/index.ts  
  main agent loop
*/

import { ollamaProvider } from "../../llmProviders";
import { generateText } from "../../llms";
import type { LlmResponse } from "../../llms/types";
import type { Agent } from "../types";
import type { AgentResponse, State, Plan, Tool } from "../types";

function fetchToolsFromRegistry(): Tool[] {
  return Object.entries(toolRegistry).map(([name, tool]) => ({
    name,
    description: tool.description,
    parameters: tool.parameters,
  }));
}

// const escalateToHuman = () => {};
type InterpretRequest = (userRequest: string) => Promise<LlmResponse>;
const interpretRequest: InterpretRequest = async (userRequest) => {
  const response = await generateText({
    model: ollamaProvider("llama3-groq-tool-use:8b"),
    prompt: `If the following request is unclear, do your best to intepret it, and return the interpreted request. If it's clear, and doesn't need interpretation, just return the exact same string. Your response will be passed to another LLM for it to generate a plan of action to complete the request. \n\nRequest: \n${userRequest}`,
    format: "string",
  });
  return response;
};

type GeneratePlan = (
  interpretedRequest: string,
  tools: Tool[],
) => Promise<LlmResponse>;
const generatePlan: GeneratePlan = async (interpretedRequest, tools) => {
  const response = await generateText({
    model: ollamaProvider("llama3-groq-tool-use:8b"),
    prompt: `based on the user request, generate a step-by-step plan for an AI agent to successfully complete the request. Consider the tools available, and return a plan. Generate a plan for [task] and output it strictly in JSON format, e.g., {"steps": [{"number": 1, "action": "description"}, ...]}. Each task should be a string specifying a task that is doable by an LLM agent.\n\nRequest: ${interpretedRequest}\n\nAvailable Tools: ${JSON.stringify(tools)}`,
    format: "json",
    tools: fetchAvailableTools(),
  });
  return response;
};

const executeTask = () => {};
const reviewTaskResult = () => {};
const revisePlan = () => {};
const isConfidentInPlan = () => {};
const handleTaskError = () => {};
const escalateToHuman = () => {};
const synthesizeResponse = () => {};

async function mainLoop(
  llm: LLM,
  request: string,
  state: State = {},
  plan?: Plan,
  depth: number = 0,
): Promise<AgentResponse> {
  // const MAX_DEPTH = 30;
  // if (depth > MAX_DEPTH) {
  //   return escalateToHuman(request, state);
  // }

  // generate plan if non provided
  const currentPlan =
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

export async function planAndExecuteAgent(llm: LLM): Promise<Agent> {
  return {
    generate: async (request: UserRequest): Promise<AgentResponse> => {
      return await mainLoop(llm, request);
    },
  };
}
