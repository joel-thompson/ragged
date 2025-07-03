import { anthropic } from "@ai-sdk/anthropic";
import { CoreMessage, generateText } from "ai";
import { NextResponse } from "next/server";

export type MessageHistoryResponse = {
  text: string;
  messages: CoreMessage[];
};

export async function POST(
  req: Request
): Promise<NextResponse<MessageHistoryResponse>> {
  const { messages } = await req.json();

  const model = anthropic("claude-3-5-haiku-latest");

  // System prompt for a text summarizer
  // const system =
  //   "You are an expert text summarizer. Given any text, provide a clear, concise summary that captures the main points and key details, using simple language.";

  const { text, response } = await generateText({
    model,
    // system,
    messages,
  });

  console.log(response.messages);

  return NextResponse.json({
    text,
    messages: response.messages,
  });
}
