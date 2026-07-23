// packages/core/src/events/EventBus.ts

export interface EventEnvelope<T = unknown> {
  readonly type: string;
  readonly timestamp: number;
  readonly source: string;
  readonly payload: T;
}

export type EventHandler<T = unknown> =
  (event: EventEnvelope<T>) => void | Promise<void>;

export class EventBus {
  private readonly listeners =
    new Map<string, Set<EventHandler>>();

  subscribe<T>(
    type: string,
    handler: EventHandler<T>
  ): () => void {

    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }

    this.listeners.get(type)!.add(handler as EventHandler);

    return () => {
      this.listeners.get(type)?.delete(handler as EventHandler);
    };
  }

  async publish<T>(
    event: EventEnvelope<T>
  ): Promise<void> {

    const handlers =
      this.listeners.get(event.type);

    if (!handlers) {
      return;
    }

    for (const handler of handlers) {
      await handler(event);
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}