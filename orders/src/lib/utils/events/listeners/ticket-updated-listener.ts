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
    const { title, price, id } = data;

    const ticket = await Ticket.findOne({ _id: id, version: data.version - 1 });

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
