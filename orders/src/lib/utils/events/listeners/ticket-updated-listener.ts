import { Message } from "node-nats-streaming";
import {
  Listener,
  TicketUpdatedEvent,
  Subjects,
} from "@eractickets/ticketing-common";

import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { title, price, id, version } = data;

    const ticket = await Ticket.findByEvent({ id, version: data.version });

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ title, price, version });
    await ticket.save();

    msg.ack();
  }
}
