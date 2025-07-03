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
          <h3 className="font-semibold mb-2">Streaming Recipe:</h3>
          <div className="space-y-2">
            {objectOutput.name && (
              <div>
                <strong>Name:</strong> {objectOutput.name}
              </div>
            )}
            {objectOutput.ingredients &&
              objectOutput.ingredients.length > 0 && (
                <div>
                  <strong>Ingredients:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    {objectOutput.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
              )}
            {objectOutput.steps && objectOutput.steps.length > 0 && (
              <div>
                <strong>Steps:</strong>
                <ol className="list-decimal pl-5 mt-1">
                  {objectOutput.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-gray-600">
              Raw JSON
            </summary>
            <pre className="whitespace-pre-wrap overflow-x-auto text-xs mt-2 p-2 bg-gray-50 rounded">
              {JSON.stringify(objectOutput, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};
