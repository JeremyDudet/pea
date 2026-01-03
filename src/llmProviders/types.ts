/*
  src/llmProvider/types.ts
  Shared types in the llms module
*/

export type LlmResponse = {
  content: string;
  thinking?: string;
};

export type LlmResponseMetadata = Record<string, unknown>;

export type LlmResponseContent = string;

export type LlmResponseStream = {
  content: Promise<ReadableStream>;
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
  messages: Array<Message>;
  format?: string; // Set the expected format of the response
  stream?: boolean;
  tools?: Tool[];
  think?: boolean;
};
