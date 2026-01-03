import type { LlmResponse } from "./types";
import type { LLM } from "./types";

interface GenerateTextParams {
  model: LLM;
  prompt: string;
  format: "string" | "json";
}
type GenerateText = (params: GenerateTextParams) => Promise<LlmResponse>;
export const generateText: GenerateText = async (config) => {
  return config.model.generateText(config.prompt);
};

/*
generateText() example usage:

const result = await generateText({
  model: anthropic("claude-sonnet-4-5"),
  prompt: 'Invent a new holiday and describe its traditions.',
});

*/
