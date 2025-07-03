"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ImageDescribeResponse } from "@/app/api/image-describe/route";

export const ImageDescribe = () => {
  const [description, setDescription] = useState<string | null>(null);
  const [url, setUrl] = useState<string>("");

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/image-describe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
        }),
      });
      return await res.json();
    },
  });

  const handleClick = async () => {
    const trimmedUrl = url.trim();
    let isValidUrl = false;
    try {
      new URL(trimmedUrl);
      isValidUrl = true;
    } catch {
      isValidUrl = false;
    }
    if (!trimmedUrl || !isValidUrl) return;
    setDescription(null);
    const result = (await mutateAsync()) as ImageDescribeResponse;
    setDescription(result.description);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Button onClick={handleClick} disabled={isPending || !url.trim()}>
        {isPending ? "Loading..." : "Describe Image"}
      </Button>

      <div className="w-full max-w-md">
        <label htmlFor="url" className="block text-sm font-medium mb-2">
          Enter image URL:
        </label>
        <Input
          id="url"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="e.g., https://example.com/image.jpg"
        />
      </div>

      {description && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-sm max-w-md">
          {description}
        </div>
      )}
    </div>
  );
};
