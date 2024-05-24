import { ID, id } from "@yaupon/id";
import {MergeDeep} from "type-fest";
import {Ark, define, Scope, Type, type as arktype,} from 'arktype'
import deepmerge from "deepmerge";
import {DefinitionParser, validateTypeRoot} from "arktype/out/type";

// Copied from: https://github.com/keinsell/escentia/blob/d6864388a850b1a964a1dd44eb31eb099b9ead7c/src/eips/messages/message.ts#L23
export enum MessageKind {
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
  messageType: MessageKind;
  headers: MessageHeaders | null;
  payload: P;
  timestamp?: Date;
  metadata: Record<string, unknown> | null;
};

type IMessageBodySchema = Ark

interface IMessageHeaders {
  [key: string]: string;
}

/**
 * Comparing to {@link IMessageHeaders} metadata is not serialized,
 * and it's there just to add additional information to class, this
 * type is extendable as there may be more fields than provided
 * by default.
 */
type IMessageMetadata<AdditionalData extends Record<string, any> = {}> = MergeDeep<{ id: ID, dateCreated: Date }, AdditionalData>


class Message<Body extends Record<string, any> = {}> {
  public id: ID
  private type: string;
  private kind: MessageKind;
  private readonly schemaDefinition?: any;
  private headers?: IMessageHeaders;
  private metadata: IMessageMetadata;
  public body?: Body
  public timestamp: number = Date.now()

  constructor(type: string, kind: MessageKind, schema: validateTypeRoot<Body, Ark>, headers?: IMessageHeaders, metadata?: Partial<IMessageMetadata>) {
    this.type = type;
    this.kind = kind;
    this.id = id({type: kind.toLowerCase()}) as any
    this.headers = headers;
    this.metadata = deepmerge({id: this.id, dateCreated: new Date()} satisfies IMessageMetadata, metadata ?? {})

    this.schemaDefinition = schema
  }
}

const CreateUserCommand: Message<{username: string}> = new Message("create.user", MessageKind.COMMAND, {
      username: "string"
})

console.log(CreateUserCommand)