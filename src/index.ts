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

export type CreateNewMessageIntent<P = unknown> = {
  messageType: MessageType;
  messageName: string;
};

export type CreateMessageIntent<P = unknown> = {
  id?: ID;
  messageType: MessageType;
  messageName: string;
  headers: MessageHeaders | null;
  payload: P;
  timestamp?: Date;
  metadata: Record<string, unknown> | null;
};

export class MessageIntent<PAYLOAD = unknown> {
  readonly id!: ID;
  readonly messageType!: MessageType;
  /** Dot-case name of the message
  @example "user.created""
  */
  readonly messageName!: string;
  readonly timestamp!: Date;
  readonly headers!: MessageHeaders | null;
  readonly payload!: PAYLOAD;
  readonly metadata!: Record<string, unknown> | null;

  constructor(create_message: {
    id?: ID;
    messageType: MessageType;
    messageName: string;
    headers: MessageHeaders | null;
    payload: PAYLOAD;
    timestamp?: Date;
    metadata: Record<string, unknown> | null;
  }) {
    this.id = id({ type: create_message.messageType.toLowerCase() });
    this.messageType = create_message.messageType;
    this.messageName = create_message.messageName;
    this.timestamp = create_message.timestamp ?? new Date();
    this.headers = create_message.headers ?? null;
    this.payload = create_message.payload;
    this.metadata = create_message.metadata ?? null;
  }

  clone(): MessageIntent<PAYLOAD> {
    return structuredClone(this);
  }
}

export interface Message<BODY = unknown> extends MessageIntent<BODY> {
  readonly id: ID;
  readonly messageType: MessageType;
  readonly messageName: string;
  readonly timestamp: Date;
  readonly headers: MessageHeaders | null;
  readonly payload: BODY;
  readonly metadata: Record<string, unknown> | null;
  new(body: BODY): Message<BODY>;
}



export function defineMessage<P>(
  defineNewMessageIntent: CreateNewMessageIntent<P>,
): Message<P> {
  return class extends MessageIntent<P> {
    constructor(create_message: P, headers?: MessageHeaders, metadata?: Record<string, unknown>) {
      super(
        {
          messageName: defineNewMessageIntent.messageName,
          messageType: defineNewMessageIntent.messageType,
          payload: create_message,
          headers: headers ? headers : null,
          metadata: metadata ? metadata : null,
        },
      );
    };

    static get messageName(): string {
      return defineNewMessageIntent.messageName;
    }
  } as any as Message<P>;
}


const UserCreated = defineMessage<{ username: string }>({
  messageType: MessageType.EVENT,
  messageName: "user.created",
});

console.log(new UserCreated({ username: "keinsell" }))
