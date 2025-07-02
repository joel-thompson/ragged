"use server";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

const model = anthropic("claude-3-5-haiku-latest");

export async function simpleAction(input: string): Promise<{
  userInput?: string;
  success: boolean;
  message: string;
  timestamp?: string;
}> {
  // Simple validation
  if (!input.trim()) {
    return {
      success: false,
      message: "Input cannot be empty",
    };
  }

  const { text } = await generateText({
    model,
    prompt: `What is the capital of France?`,
  });

  return {
    message: text,
    userInput: input,
    success: true,
    timestamp: new Date().toISOString(),
  };
}
