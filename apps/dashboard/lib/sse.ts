/**
 * SSE Client for real-time execution streaming
 */
export interface SSEEvent {
  event: string;
  data: any;
  timestamp: string;
}

export interface SSEConnection {
  executionId: string;
  eventSource: EventSource | null;
  onMessage: (event: SSEEvent) => void;
  onError: (error: Event) => void;
  onClose: () => void;
}

class SSEClient {
  private connections: Map<string, SSEConnection> = new Map();
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || "https://your-api-name.onrender.com") {
    this.baseUrl = baseUrl;
  }

  /**
   * Connect to SSE stream for an execution
   */
  connect(
    executionId: string,
    onMessage: (event: SSEEvent) => void,
    onError?: (error: Event) => void,
    onClose?: () => void
  ): () => void {
    // Close existing connection if any
    this.disconnect(executionId);

    const url = `${this.baseUrl}/api/v1/stream/${executionId}`;

    // Create EventSource connection
    const eventSource = new EventSource(url);

    const connection: SSEConnection = {
      executionId,
      eventSource,
      onMessage,
      onError: onError || (() => {}),
      onClose: onClose || (() => {}),
    };

    // Set up event listeners
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const sseEvent: SSEEvent = {
          event: data.event || "update",
          data: data,
          timestamp: new Date().toISOString(),
        };
        onMessage(sseEvent);
      } catch (e) {
        console.error("Failed to parse SSE message:", e);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      if (onError) {
        onError(error);
      }
      // Close connection on error
      this.disconnect(executionId);
    };

    eventSource.onopen = () => {
      console.log(`SSE connected for execution ${executionId}`);
    };

    this.connections.set(executionId, connection);

    // Return cleanup function
    return () => this.disconnect(executionId);
  }

  /**
   * Disconnect from SSE stream
   */
  disconnect(executionId: string): void {
    const connection = this.connections.get(executionId);
    if (connection) {
      if (connection.eventSource) {
        connection.eventSource.close();
      }
      connection.onClose();
      this.connections.delete(executionId);
    }
  }

  /**
   * Disconnect all connections
   */
  disconnectAll(): void {
    for (const [executionId] of this.connections) {
      this.disconnect(executionId);
    }
  }

  /**
   * Get connection status
   */
  isConnected(executionId: string): boolean {
    const connection = this.connections.get(executionId);
    return connection?.eventSource?.readyState === EventSource.OPEN;
  }

  /**
   * Get historical events for an execution
   */
  async getHistory(executionId: string): Promise<SSEEvent[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/v1/stream/${executionId}/history`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.events || [];
    } catch (error) {
      console.error("Failed to fetch execution history:", error);
      return [];
    }
  }
}

// Export singleton instance
export const sseClient = new SSEClient();

// React hook for using SSE
import { useEffect, useRef, useState } from "react";

export function useSSE(executionId: string | null) {
  const [events, setEvents] = useState<SSEEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!executionId) return;

    // Load historical events first
    sseClient.getHistory(executionId).then((history) => {
      setEvents(history);
    });

    // Connect to live stream
    cleanupRef.current = sseClient.connect(
      executionId,
      (event) => {
        setEvents((prev) => [...prev, event]);
      },
      (error) => {
        console.error("SSE error:", error);
        setIsConnected(false);
      },
      () => {
        setIsConnected(false);
      }
    );

    setIsConnected(true);

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [executionId]);

  return { events, isConnected };
}

export default sseClient;
