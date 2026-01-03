#!/usr/bin/env bun

// src/cli/index.ts

import { agentRegistry } from "../agents";
import { providerRegistry } from "../llmProviders";
import { toolRegistry } from "../tools";
import readline from "readline";

const agent = agentRegistry.planAndExecute;

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(prompt, resolve);
    });
  };

  console.log("PEA CLI - type 'exit' to quit\n");

  while (true) {
    const userInput = await question("You: ");

    if (userInput.toLowerCase() === "exit") {
      break;
    }

    console.log("\nAgent: ");
    const response = await agent(userInput, {}, undefined, 0);

    console.log(response + "\n");
  }

  rl.close();
}

main();
