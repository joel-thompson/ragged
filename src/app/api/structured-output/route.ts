import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

export type StructuredOutputResponse = {
  name: string;
  ingredients: string[];
  steps: string[];
};

export async function POST(): Promise<NextResponse<StructuredOutputResponse>> {
  const model = anthropic("claude-3-5-haiku-latest");

  // System prompt for a text summarizer
  // const system =
  //   "You are an expert text summarizer. Given any text, provide a clear, concise summary that captures the main points and key details, using simple language.";

  const { object } = await generateObject({
    model,
    // system,
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

  console.log(object);

  return NextResponse.json(object);
}
