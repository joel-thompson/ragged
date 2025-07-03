"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ClassifyResponse } from "@/app/api/classify/route";

export const Classify = () => {
  const [category, setCategory] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });
      return await res.json();
    },
  });

  const handleClick = async () => {
    if (!prompt.trim()) return;
    const result = (await mutateAsync()) as ClassifyResponse;
    setCategory(result.category);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Button onClick={handleClick} disabled={isPending || !prompt.trim()}>
        {isPending ? "Loading..." : "Classify"}
      </Button>

      <div className="w-full max-w-md">
        <label htmlFor="prompt" className="block text-sm font-medium mb-2">
          Enter text to classify:
        </label>
        <Input
          id="prompt"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., I am feeling great today"
        />
      </div>

      {category && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-sm">{category}</div>
      )}
    </div>
  );
};
