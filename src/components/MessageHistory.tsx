"use client";

import { MessageHistoryResponse } from "@/app/api/message-history/route";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { CoreMessage } from "ai";
import { useState } from "react";

export const MessageHistory = () => {
  const [completion, setCompletion] = useState<string | null>(null);
  const [messages, setMessages] = useState<CoreMessage[]>([]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (messages: CoreMessage[]) => {
      const res = await fetch("/api/message-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
        }),
      });
      return await res.json();
    },
  });

  const handleClick = async () => {
    setCompletion(null);
    const newMessages: CoreMessage[] = [
      ...messages,
      { role: "user", content: "Hello, how are you?" },
    ];
    setMessages(newMessages);
    const result = (await mutateAsync(newMessages)) as MessageHistoryResponse;
    setCompletion(result.text);
    setMessages((prev) => [...prev, ...result.messages]);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Button onClick={handleClick} disabled={isPending}>
        {isPending ? "Loading..." : "Message History"}
      </Button>

      {completion && (
        <>
          <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
            Completion: {completion}
          </div>
        </>
      )}
      {messages.length > 0 && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
          <div className="font-semibold mb-2">Messages:</div>
          <pre className="whitespace-pre-wrap overflow-x-auto text-xs">
            {JSON.stringify(messages, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
