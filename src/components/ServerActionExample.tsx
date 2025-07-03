"use client";

import React, { useState } from "react";
import { simpleAction } from "@/server/actions/simpleAction";
import { Button } from "./ui/button";

export function ServerActionExample() {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    const res = await simpleAction("Hello from client component");
    setResult(JSON.stringify(res, null, 2));
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Button onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Loading..." : "Call Server Action"}
      </Button>

      {result && !isLoading && (
        <pre className="mt-2 p-2 bg-gray-100 rounded text-sm">{result}</pre>
      )}
    </div>
  );
}
