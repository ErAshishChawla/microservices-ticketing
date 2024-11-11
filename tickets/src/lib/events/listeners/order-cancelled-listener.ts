import { Message } from "node-nats-streaming";
import {
  Listener,
  OrderCancelledEvent,
  Subjects,
} from "@eractickets/ticketing-common";

import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";
import { Ticket } from "../../../models/ticket";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = "tickets-service";

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // Extract the data from the event
    const { ticket } = data;

    // Find the ticket that the order is reserving
    const existingTicket = await Ticket.findById(ticket.id);

    // If the ticket is not found, throw an error
    if (!existingTicket) {
      throw new Error("Ticket not found");
    }

    // Update the ticket with the orderId to undefined
    existingTicket.set({ orderId: undefined });

    // Save the ticket
    await existingTicket.save();

    // Handle missing ticket updated event to update version in the order service
    await new TicketUpdatedPublisher(this.client).publish({
      id: existingTicket.id,
      version: existingTicket.version,
      title: existingTicket.title,
      price: existingTicket.price,
      userId: existingTicket.userId,
      orderId: existingTicket.orderId,
    });

    // Acknowledge the message
    msg.ack();
  }
}
