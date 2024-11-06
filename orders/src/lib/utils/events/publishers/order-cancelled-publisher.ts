import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from "@eractickets/ticketing-common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
