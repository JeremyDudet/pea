/*
  index.ts
  root of the application 
*/

import { PlanAndExecuteAgent } from "./src/agents";
import { ollama } from "./src/llmProviders";
import { createAgent } from "./src/agents/utils";

const myAgent = createAgent({
  agentType: "planAndExecute",
  llmProvider: "ollama",
  model: "llama3-groq-tool-use:8b",
  tools: {},
  // agentInstructions: myAgentInstructions;
});

const response = await myAgent.generate({
  prompt: "Who are you?",
});

for await (const part of response) {
  process.stdout.write(part);
}
