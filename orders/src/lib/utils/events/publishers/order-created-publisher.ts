import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from "@eractickets/ticketing-common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
