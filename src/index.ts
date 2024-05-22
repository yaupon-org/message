import { ID, id } from "@yaupon/id";

// Copied from: https://github.com/keinsell/escentia/blob/d6864388a850b1a964a1dd44eb31eb099b9ead7c/src/eips/messages/message.ts#L23
export enum MessageType {
  /**
   * @see [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/patterns/messaging/EventMessage.html)
   */
  EVENT = "EVENT",
  /**
   * @see [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/patterns/messaging/CommandMessage.html)
   */
  COMMAND = "COMMAND",
  /**
   * @see [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/patterns/messaging/DocumentMessage.html)
   */
  DOCUMENT = "DOCUMENT",
  /**
   * @see [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/patterns/messaging/RequestReply.html)
   */
  REQUEST = "REQUEST",
  /**
   * @see [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/patterns/messaging/RequestReply.html)
   */
  REPLY = "REPLY",
}

export interface MessageHeaders {
  /** A correlation ID is a unique identifier used to correlate and track a
   * specific transaction or event as it moves through a distributed system or
   * across different components. It helps to trace the flow of a request and
   * its associated responses across different services and systems. Correlation IDs
   * can be generated and propagated automatically by software components or added
   * manually by developers for debugging and troubleshooting purposes.
   *
   * @see [RailsEventStore](https://railseventstore.org/docs/v2/correlation_causation/)
   * @see [thenativeweb/commands-events/#1](https://github.com/thenativeweb/commands-events/issues/1#issuecomment-385862281)
   */
  readonly correlationId: ID | string | null;
  /** `causationId` is an identifier used in event-driven architectures to track
   * the causal relationship between events. It represents the ID of the event that
   * caused the current event to occur. This can be useful for tracing and debugging
   * issues in distributed systems, as it allows developers to see the sequence of
   * events that led to a particular state or behavior.
   *
   * @see [RailsEventStore](https://railseventstore.org/docs/v2/correlation_causation/)
   * @see [thenativeweb/commands-events/#1](https://github.com/thenativeweb/commands-events/issues/1#issuecomment-385862281)
   */
  readonly causationId?: ID | string | null;
}

export type CreateMessageIntent<P = unknown> = {
  id?: ID;
  messageType: MessageType;
  headers: MessageHeaders | null;
  payload: P;
  timestamp?: Date;
  metadata: Record<string, unknown> | null;
};

export class MessageIntent<P = unknown> {
  readonly id!: ID;
  readonly messageType!: MessageType;
  readonly timestamp!: Date;
  readonly headers!: MessageHeaders | null;
  readonly payload!: P;
  readonly metadata!: Record<string, unknown> | null;

  constructor(constructor: CreateMessageIntent<P>) {
    this.id = id({ type: constructor.messageType.toLowerCase() });
    this.messageType = constructor.messageType;
    this.timestamp = constructor.timestamp ?? new Date();
    this.headers = constructor.headers ?? null;
    this.payload = constructor.payload;
    this.metadata = constructor.metadata ?? null;
  }

  clone(): MessageIntent<P> {
    return structuredClone(this);
  }
}

export function defineMessage<P = unknown>(
  constructor: CreateMessageIntent<P>,
): MessageIntent<P> {
  return new MessageIntent(constructor);
}
