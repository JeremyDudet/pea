/*
    src/tools/index.ts
    Main export for Tools
*/

import { memoryTools } from "./memory";
export * from "./web";

export const tools = [...memoryTools, ...webTool];

type Tool = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<string, { type: string; description: string }>;
      required: string[];
    };
  };
};
