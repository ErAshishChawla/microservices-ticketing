import { Publisher, Subjects, TicketCreatedEvent } from "@eractickets/ticketing-common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated
}

