import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from "@eractickets/ticketing-common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
