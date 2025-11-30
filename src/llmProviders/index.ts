/*
    Main export for LLM providers
*/

import { ollamaProvider } from "./adapters/ollama";

export const providerRegistry = {
  ollama: ollamaProvider(),
  // add more here
};
