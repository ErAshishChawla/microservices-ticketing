import { Message } from "node-nats-streaming";
import {
  Listener,
  TicketCreatedEvent,
  Subjects,
} from "@eractickets/ticketing-common";

import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { title, price, id, userId } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
      userId,
    });
    await ticket.save();

    msg.ack();
  }
}
