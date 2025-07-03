import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { NextResponse } from "next/server";

export type ClassifyResponse = {
  category: string;
};

export async function POST(
  req: Request
): Promise<NextResponse<ClassifyResponse>> {
  const { prompt } = await req.json();

  const model = anthropic("claude-3-5-haiku-latest");

  const { object } = await generateObject({
    model,
    output: "enum",
    enum: ["positive", "negative", "neutral"],
    system: "Classify the following text into a category",
    prompt,
  });

  return NextResponse.json({
    category: object,
  });
}
