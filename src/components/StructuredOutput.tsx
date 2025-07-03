"use client";

import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { StructuredOutputResponse } from "@/app/api/structured-output/route";

export const StructuredOutput = () => {
  const [objectOutput, setObjectOutput] =
    useState<StructuredOutputResponse | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/structured-output", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({
        //   messages,
        // }),
      });
      return await res.json();
    },
  });

  const handleClick = async () => {
    const result = (await mutateAsync()) as StructuredOutputResponse;
    setObjectOutput(result);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Button onClick={handleClick} disabled={isPending}>
        {isPending ? "Loading..." : "Structured Output"}
      </Button>

      {objectOutput && Object.keys(objectOutput).length > 0 && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
          <pre className="whitespace-pre-wrap overflow-x-auto text-xs">
            {JSON.stringify(objectOutput, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
