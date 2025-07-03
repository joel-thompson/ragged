"use client";

import { useCompletion } from "@ai-sdk/react";
import { Button } from "./ui/button";

export const BasicStreamComplete = () => {
  const { completion, complete, isLoading } = useCompletion({
    api: "/api/basic-stream-complete",
  });

  const handleClick = () => {
    complete("I like beans very much, I also like potatoes");
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Button onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Loading..." : "Basic Stream Complete"}
      </Button>

      {completion && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-sm">{completion}</div>
      )}
    </div>
  );
};
