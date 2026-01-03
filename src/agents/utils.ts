/*
    src/agents/utils.ts
*/

import { fold, left } from "fp-ts/Either";
import type { Either } from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { getAgent } from "./index";
import { getLlmProvider } from "../llmProviders";
import type { Agent, State } from "./types";
import type { LlmProvider } from "../llmProviders/types";

interface AgentSpecs {
  agent: string;
  provider: string;
  model: string;
  tools: Array<string>;
  state: State;
  agentPrompt: string;
}

/*
  example usage

  const exampleAgent = createAgent({
    agentType: "planAndExecute",
    llmProvider: "ollama",
    model: "llama3-groq-tool-use:8b",
    tools: [],
    initialState: {},
  });

  ExampleAgent is an object literal
*/

type CreateAgent = (agentSpecs: AgentSpecs) => Agent;
export const createAgent: CreateAgent = (agentSpecs: AgentSpecs): Agent => {
  return {}; // returns teh configured agent
};

export const handleToolCalls;
