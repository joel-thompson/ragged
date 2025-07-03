// Re-export server utilities
export * from "./server";

export type StreamingOptions = {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
};

export type SSEData = {
  data: string;
  event?: string;
  id?: string;
};

/**
 * Parses Server-Sent Events from a ReadableStream
 */
export async function* parseSSEStream({
  reader,
}: {
  reader: ReadableStreamDefaultReader<Uint8Array>;
}): AsyncGenerator<SSEData> {
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      // Keep the last potentially incomplete line in buffer
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data) {
            yield { data };
          }
        }
        // Could extend to handle other SSE fields like event:, id:, etc.
      }
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {
      // Reader might already be released
    }
  }
}

/**
 * Makes a streaming request and returns the reader
 */
export async function createStreamingRequest({
  url,
  method = "POST",
  headers = {},
  body,
}: StreamingOptions): Promise<ReadableStreamDefaultReader<Uint8Array>> {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body,
  });

  if (!response.body) {
    throw new Error("No response body");
  }

  return response.body.getReader();
}

/**
 * Higher-level function that combines request creation and SSE parsing
 */
export async function* streamSSE({
  url,
  method = "POST",
  headers = {},
  body,
}: StreamingOptions): AsyncGenerator<SSEData> {
  const reader = await createStreamingRequest({ url, method, headers, body });
  yield* parseSSEStream({ reader });
}

/**
 * Convenience function for streaming JSON data
 */
export async function streamJSON<T>({
  url,
  method = "POST",
  headers = {},
  body,
  onData,
  onError,
}: StreamingOptions & {
  onData: (data: T) => void;
  onError?: (error: Error) => void;
}): Promise<void> {
  try {
    for await (const { data } of streamSSE({ url, method, headers, body })) {
      try {
        const jsonData = JSON.parse(data) as T;
        onData(jsonData);
      } catch (e) {
        const error = new Error(`Failed to parse JSON: ${e}`);
        if (onError) {
          onError(error);
        } else {
          console.error(error, "Data:", data);
        }
      }
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    if (onError) {
      onError(err);
    } else {
      console.error("Streaming error:", err);
    }
  }
}
