/*
    Ollama specific adapter for locally running LLMs
*/

import ollama from "ollama";
import type { LlmConfig, LlmProvider, LlmResponse } from "../types";
import { Readable } from "stream";

export type OllamaConfig = LlmConfig & {
  host?: string; // Default: 'http://localhost:11434'
  stream?: boolean; // Default: false
};

export function createOllamaProvider(config: OllamaConfig) {
  const { model } = config; // Immutable

  return async function chatStream(prompt: string): Promise<Readable> {
    const message = { role: "user", content: prompt };

    const response = await ollama.chat({
      model,
      messages: [message],
      stream: true,
    });

    const stream = new Readable({
      read() {},
    });

    let inThinking = false;
    let content = "";
    let thinking = "";

    (async () => {
      try {
        for await (const part of response) {
          if (part.message.thinking) {
            if (!inThinking) {
              inThinking = true;
              stream.push("Thinking:\n");
            }
            stream.push(part.message.thinking);
            // accumulate the partial thinking
            thinking += part.message.thinking;
          } else if (part.message.content) {
            if (inThinking) {
              inThinking = false;
              stream.push("\n\nAnswer:\n");
            }

            stream.push(part.message.content);
            // accumulate the partial content
            content += part.message.content;
          }
        }
        stream.push(null); // End the stream
      } catch (err) {
        stream.destroy(err as Error);
      }
    })();

    return stream;
  };
}
