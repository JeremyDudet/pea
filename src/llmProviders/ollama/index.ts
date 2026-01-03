/*
    src/llmProviders/ollama/index.ts
    Ollama specific adapter for locally running LLMs
*/

import ollama from "ollama";
import { Readable } from "stream";

export function ollamaProvider(model: string) {
  async function generateText(request: any): Promise<Readable> {
    const response = await ollama.chat({
      model,
      messages: request.messages,
      stream: true,
      tools: request.tools,
      format: request.format,
    });

    const responseStream = new Readable({
      read() {},
    });

    let inThinking = false;

    (async () => {
      try {
        for await (const part of response) {
          if (part.message.thinking && !inThinking) {
            inThinking = true;
            responseStream.push("Thinking:\n");
          }
          if (part.message.thinking) {
            responseStream.push(part.message.thinking);
          } else if (part.message.content) {
            if (inThinking) {
              inThinking = false;
              responseStream.push("\n\nAnswer:\n");
            }
            responseStream.push(part.message.content);
          }
        }
        responseStream.push(null); // End the stream
      } catch (err) {
        responseStream.destroy(err as Error);
      }
    })();

    return responseStream;
  }

  return {
    generateText,
  };
}
