import { planAndExecuteAgent } from "./plan-and-execute";
import type { AgentImplementation } from "./types";

export const agentRegistry: Record<string, AgentImplementation> = {
  planAndExecute: planAndExecuteAgent,
};
