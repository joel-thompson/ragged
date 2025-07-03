"use server";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

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

  const { text, textStream } = streamText({
    model,
    prompt: `What is the capital of France?`,
  });

  for await (const chunk of textStream) {
    console.log(chunk);
  }

  return {
    message: await text,
    userInput: input,
    success: true,
    timestamp: new Date().toISOString(),
  };
}
