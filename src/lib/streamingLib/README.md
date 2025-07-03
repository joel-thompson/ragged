# Streaming Library

Reusable utilities for handling Server-Sent Events (SSE) and streaming data in React components.

## Features

- ✅ Robust buffer management for chunked data
- ✅ Proper resource cleanup
- ✅ Type-safe streaming with generics
- ✅ Multiple abstraction levels (low-level to high-level)
- ✅ Error handling with custom callbacks

## API Reference

### `streamJSON<T>(options, onData, onError?)`

**High-level function for streaming JSON data**

```typescript
import { streamJSON } from "@/lib/streamingLib";

await streamJSON<MyDataType>(
  {
    url: "/api/my-endpoint",
    method: "POST",
    headers: { "Authorization": "Bearer token" },
    body: JSON.stringify({ prompt: "Hello" })
  },
  (data) => {
    // Handle each JSON object as it arrives
    console.log("Received:", data);
  },
  (error) => {
    // Optional error handler
    console.error("Stream error:", error);
  }
);
```

### `streamSSE(options)`

**Mid-level function that returns an async generator**

```typescript
import { streamSSE } from "@/lib/streamingLib";

for await (const { data } of streamSSE({ url: "/api/events" })) {
  console.log("Raw SSE data:", data);
  // Parse data as needed
}
```

### `parseSSEStream(reader)`

**Low-level function for parsing SSE from a ReadableStream**

```typescript
import { parseSSEStream, createStreamingRequest } from "@/lib/streamingLib";

const reader = await createStreamingRequest({ url: "/api/events" });
for await (const { data } of parseSSEStream(reader)) {
  console.log("Parsed SSE:", data);
}
```

## Usage Examples

### Basic JSON Streaming Component

```typescript
"use client";

import { useState } from "react";
import { streamJSON } from "@/lib/streamingLib";

export const MyStreamingComponent = () => {
  const [data, setData] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleStream = async () => {
    setIsStreaming(true);
    try {
      await streamJSON(
        { url: "/api/my-stream" },
        (newData) => setData(newData),
        (error) => console.error(error)
      );
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div>
      <button onClick={handleStream} disabled={isStreaming}>
        {isStreaming ? "Streaming..." : "Start Stream"}
      </button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};
```

### Custom SSE Processing

```typescript
import { streamSSE } from "@/lib/streamingLib";

const processCustomStream = async () => {
  for await (const { data } of streamSSE({ url: "/api/custom" })) {
    if (data.startsWith("event:")) {
      // Handle custom event format
      const event = JSON.parse(data.slice(6));
      handleCustomEvent(event);
    }
  }
};
```

## Error Handling

The library provides multiple levels of error handling:

1. **Network errors**: Caught by the fetch request
2. **Stream errors**: Caught during reading
3. **JSON parsing errors**: Caught during parsing (with detailed logs)
4. **Custom error handling**: Via optional error callbacks

## Benefits

- **No copy-paste**: Reuse across components
- **Type safety**: Full TypeScript support
- **Robust**: Handles edge cases like split chunks
- **Flexible**: Multiple abstraction levels
- **Clean**: Automatic resource cleanup 