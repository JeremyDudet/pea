/*
Shared types in the llms module
*/

export type LlmResponse =
  | { stream: false; content: string; metadata?: LlmResponseMetadata }
  | { stream: true; content: string; metadata?: LlmResponseMetadata };

export type LlmResponseMetadata = Record<string, unknown>;

export type LlmResponseContent = string;

export type LlmResponseStream = {
  content: Promise<ReadableStream>;
};

export type LlmConfig = {
  model: string; // e.g. 'llama3-groq-tool-use:8b' or 'deepseek-r1:7b'
};

export type LlmProvider = (prompt: string) => Promise<LlmResponse>;

export type Result<T> = { ok: true; value: T } | { ok: false; error: Error };
export type SafeLlmProvider = (
  prompt: string,
  config: LlmConfig,
) => Promise<Result<LlmResponse>>;
