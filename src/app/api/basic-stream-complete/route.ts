import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

export async function POST(req: Request) {
  // Extract the prompt from the request body
  const { prompt } = await req.json();

  const model = anthropic("claude-3-5-haiku-latest");

  // System prompt for a text summarizer
  const system =
    "You are an expert text summarizer. Given any text, provide a clear, concise summary that captures the main points and key details, using simple language.";

  const result = streamText({
    model,
    system,
    prompt,
  });

  console.log("streaming started");

  return result.toDataStreamResponse();
}
