import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export type ImageDescribeResponse = {
  description: string;
};

export async function POST(
  req: Request
): Promise<NextResponse<ImageDescribeResponse>> {
  const { url } = await req.json();

  const model = anthropic("claude-3-5-haiku-latest");

  const { text } = await generateText({
    model,
    system:
      "Describe the following image. Keep it concise and to the point. Use simple language. Under 160 characters.",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            image: new URL(url),
          },
        ],
      },
    ],
  });

  return NextResponse.json({
    description: text,
  });
}
