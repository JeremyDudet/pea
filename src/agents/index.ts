/*
  src/agents/index.ts
  Main export for Agents
*/

import { planAndExecuteAgent } from "./plan-and-execute";
import type { Agent } from "./types";
import { left, right } from "fp-ts/Either";
import type { Either } from "fp-ts/Either";

export const getAgent = (agentName: string): Either<Error, Agent> => {
  const agentRegistry = {
    planAndExecuteAgent,
    // add more here
  };

  const selectedAgent = agentRegistry[agentName as keyof typeof agentRegistry];

  return selectedAgent
    ? right(selectedAgent)
    : left(
        new Error(
          `Provider "${agentName}" not found. Available providers: ${Object.keys(agentRegistry).join(", ")}`,
        ),
      );
};
