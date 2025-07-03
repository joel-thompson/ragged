"use client";

import { Button } from "./ui/button";
import { useState } from "react";
import { StructuredOutputResponse } from "@/app/api/structured-output-stream/route";
import { streamJSON } from "@/lib/streamingLib";

export const StructuredOutputStream = () => {
  const [objectOutput, setObjectOutput] =
    useState<Partial<StructuredOutputResponse> | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleStreamingRequest = async () => {
    setIsStreaming(true);
    setObjectOutput(null);

    try {
      await streamJSON<StructuredOutputResponse>({
        url: "/api/structured-output-stream",
        method: "POST",
        onData: (data) => {
          setObjectOutput(data);
        },
        onError: (error) => {
          console.error("Streaming error:", error);
        },
      });
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
