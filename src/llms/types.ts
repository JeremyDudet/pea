import { Readable } from "stream";

export type LlmResponse = string | Readable | JSON;

export type LlmProvider = (model: string) => LLM;

export type LLM = {
  generateText: (request: LLMRequest) => Promise<LlmResponse>;
};
