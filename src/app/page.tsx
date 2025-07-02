import React from "react";
import { ServerActionExample } from "@/components/ServerActionExample";

// this page has a mix of examples using the features in this template

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">Hello World</h1>

      <ServerActionExample />
    </div>
  );
}
