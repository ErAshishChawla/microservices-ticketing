import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@eractickets/ticketing-common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
