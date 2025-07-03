import React from "react";
import { ServerActionExample } from "@/components/ServerActionExample";
import { BasicStreamComplete } from "@/components/BasicStreamComplete";
import { MessageHistory } from "@/components/MessageHistory";
import { StructuredOutput } from "@/components/StructuredOutput";
import { StructuredOutputStream } from "@/components/StructuredOutputStream";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold p-8">
        Some buttons to test out the different features
      </h1>
      <StructuredOutputStream />
      <StructuredOutput />
      <MessageHistory />
      <BasicStreamComplete />
      <ServerActionExample />
    </div>
  );
}
