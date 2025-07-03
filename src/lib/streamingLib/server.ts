/**
 * Server-side streaming utilities for API routes
 */

/**
 * Standard SSE response headers
 */
export const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
} as const;

/**
 * Creates an SSE-formatted data chunk
 */
export function createSSEChunk({
  data,
  event,
  id,
}: {
  data: string;
  event?: string;
  id?: string;
}): string {
  let chunk = "";

  if (event) {
    chunk += `event: ${event}\n`;
  }

  if (id) {
    chunk += `id: ${id}\n`;
  }

  chunk += `data: ${data}\n\n`;

  return chunk;
}

/**
 * Creates a ReadableStream that sends any async iterable as SSE
 */
export function createSSEStream<T>({
  iterable,
  transform = (item: T) => String(item),
  event,
  onError,
}: {
  iterable: AsyncIterable<T>;
  transform?: (item: T) => string;
  event?: string;
  onError?: (error: Error) => void;
}): ReadableStream<Uint8Array> {
  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        for await (const item of iterable) {
          const data = transform(item);
          const chunk = createSSEChunk({ data, event });
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        if (onError) {
          onError(err);
        }
        controller.error(err);
      }
    },
  });
}

/**
 * Creates a Response with SSE stream
 */
export function createSSEResponse<T>({
  iterable,
  transform,
  event,
  onError,
  headers = {},
}: {
  iterable: AsyncIterable<T>;
  transform?: (item: T) => string;
  event?: string;
  onError?: (error: Error) => void;
  headers?: Record<string, string>;
}): Response {
  const stream = createSSEStream({ iterable, transform, event, onError });

  return new Response(stream, {
    headers: {
      ...SSE_HEADERS,
      ...headers,
    },
  });
}

/**
 * Helper specifically for streaming JSON objects
 */
export function streamJSONResponse<T>({
  iterable,
  onError,
  headers,
}: {
  iterable: AsyncIterable<T>;
  onError?: (error: Error) => void;
  headers?: Record<string, string>;
}): Response {
  return createSSEResponse({
    iterable,
    transform: (item: T) => JSON.stringify(item),
    onError,
    headers,
  });
}

/**
 * Helper for AI SDK streaming patterns
 */
export function streamAIResponse<T>({
  streamResult,
  onError,
  headers,
}: {
  streamResult: { partialObjectStream: AsyncIterable<T> };
  onError?: (error: Error) => void;
  headers?: Record<string, string>;
}): Response {
  return streamJSONResponse({
    iterable: streamResult.partialObjectStream,
    onError,
    headers,
  });
}
