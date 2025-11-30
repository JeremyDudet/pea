import { providerRegistry } from "./src/llmProviders";
import type { ChatRequest, Message } from "./src/llmProviders/types";

console.log("Starting program...");

const llm = providerRegistry["ollama"];

const messages: Array<Message> = [
  {
    role: "system",
    content: ``,
  },
  {
    role: "user",
    content: `
      In what circumstances are you, the llm, intentionally allowed to lie?
    `,
  },
];

const request: ChatRequest = {
  model: "llama3.2:3b",
  messages: messages,
  stream: true,
  // format: "json",
};

const response = await llm.chat(request);

for await (const part of response) {
  process.stdout.write(part);
}
