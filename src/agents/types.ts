/*
  src/agents/types.ts
*/

import type { Either } from "fp-ts/Either";
import type {
  LLM,
  ChatRequest,
  ChatResponse,
  Message,
} from "../llmProviders/types";

export type AgentResponse = string;

export type State = Record<string, any>;

export type ToolParam = {
  type: string; // e.g., "string", "integer", "boolean", "array"
  description: string;
  required?: boolean; // Default: false
  default?: any; // Optional default value for non-required params
  enum?: string[]; // Optional: Restrict to specific values (for unions)
};

export type Tool = {
  name: string;
  description: string;
  parameters: Record<string, ToolParam>;
};

export type Task = {
  id: string;
  description: string;
  toolName: string;
  parameters: Record<string, any>;
};

export type Plan = Task[];

export type ReviewResult = {
  approved: boolean;
  feedback?: string;
};

export type Agent = {
  generate: (request: UserRequest) => Promise<AgentResponse>;
};

export type AgentOptions = {
  maxIterations?: number; // to prevent infinite loops
  tools?: Tool[]; // from your existing types
};

// LLM-enabled agent: accepts LLM, returns Agent
export type AgentImplementation = (llm: LLM) => Agent;

// Stage 2 return: function waiting for model name
export type ModelSelector = (model: string) => Either<Error, Agent>;

// Stage 1 return: function waiting for provider name
export type AgentFactory = (llm: LLM) => Agent;

// Update registry type
export type AgentRegistry = Record<string, AgentImplementation>;
