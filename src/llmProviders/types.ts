/*
Shared types in the llms module
*/
import { Readable } from "stream";

export type LlmResponse = {
  content: string;
  thinking?: string;
};

export type LlmResponseMetadata = Record<string, unknown>;

export type LlmResponseContent = string;

export type LlmResponseStream = {
  content: Promise<ReadableStream>;
};

export type LlmConfig = {
  model: string; // e.g. 'llama3-groq-tool-use:8b' or 'deepseek-r1:7b'
};

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
  tool_name?: string; // Add the name of the tool that was executed to inform the model of the result
};

export type Tool = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      required: ["city"];
    };
  };
};

export type ChatRequest = {
  model: string;
  messages: Array<Message>;
  format?: string; // Set the expected format of the response
  stream?: boolean;
  tools?: Tool[];
  think?: boolean;
};

export type ChatResponse = Promise<string | Readable>;

export type LlmProvider = {
  chat: (request: ChatRequest) => ChatResponse;
};

export type Result<T> = { ok: true; value: T } | { ok: false; error: Error };

export type SafeLlmProvider = (
  prompt: string,
  config: LlmConfig,
) => Promise<Result<LlmResponse>>;
