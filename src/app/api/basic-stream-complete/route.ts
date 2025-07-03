import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

export async function POST(req: Request) {
  // Extract the prompt from the request body
  const { prompt } = await req.json();

  const model = anthropic("claude-3-5-haiku-latest");

  const result = streamText({
    model,
    prompt: prompt, // Use the prompt from the request
  });

  console.log("streaming started");

  return result.toDataStreamResponse();
}
