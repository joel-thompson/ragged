"use client";

import { Button } from "./ui/button";
import { useState } from "react";
import { StructuredOutputResponse } from "@/app/api/structured-output-stream/route";

export const StructuredOutputStream = () => {
  const [objectOutput, setObjectOutput] =
    useState<Partial<StructuredOutputResponse> | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleStreamingRequest = async () => {
    setIsStreaming(true);
    setObjectOutput(null);

    try {
      const response = await fetch("/api/structured-output-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              setObjectOutput(data);
            } catch (e) {
              console.error("Failed to parse JSON:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Button onClick={handleStreamingRequest} disabled={isStreaming}>
        {isStreaming ? "Streaming..." : "Structured Output Stream"}
      </Button>

      {objectOutput && (
        <div className="mt-2 p-4 bg-gray-100 rounded text-sm w-full max-w-2xl">
          <pre className="whitespace-pre-wrap overflow-x-auto text-xs mt-2 p-2 bg-gray-50 rounded">
            {JSON.stringify(objectOutput, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
