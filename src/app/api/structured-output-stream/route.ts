import { anthropic } from "@ai-sdk/anthropic";
import { streamObject } from "ai";
import { z } from "zod";
import { streamAIResponse } from "@/lib/streamingLib";

export type StructuredOutputResponse = {
  name: string;
  ingredients: string[];
  steps: string[];
};

export async function POST() {
  const model = anthropic("claude-3-5-haiku-latest");

  const result = streamObject({
    model,
    prompt: "what is the recipe for vanilla ice cream",
    schema: z
      .object({
        name: z.string().describe("The name of the recipe"),
        ingredients: z
          .array(z.string())
          .describe("A list of ingredients required for the recipe"),
        steps: z
          .array(z.string())
          .describe("Step-by-step instructions to prepare the recipe"),
      })
      .describe("A recipe with name, ingredients, and steps"),
  });

  return streamAIResponse({ streamResult: result });
}
