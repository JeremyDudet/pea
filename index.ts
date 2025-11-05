import { createOllamaProvider } from "./src/llms/adapters/ollamaLocal";

console.log("hello from index");

const llmConfig = {
  model: "deepseek-r1:7b",
  stream: true,
};

const llm = createOllamaProvider(llmConfig);
const prompt = "why is the sky blue?";
const response = await llm(prompt);
for await (const part of response) {
  process.stdout.write(part);
}
