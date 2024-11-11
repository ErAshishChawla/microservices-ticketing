import {
  Listener,
  ExpirationCompleteEvent,
  Subjects,
  OrderStatus,
} from "@eractickets/ticketing-common";
import { Message } from "node-nats-streaming";

import { Order } from "../../../../models/order";

import { queueGroupName } from "./queue-group-name";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    console.log("Event data!", data);

    const existingOrder = await Order.findById(data.orderId).populate("ticket");

    if (!existingOrder) {
      throw new Error("Order not found");
    }

    if (existingOrder.status == OrderStatus.Complete) {
      return msg.ack();
    }

    existingOrder.set({
      status: OrderStatus.Cancelled,
    });

    await existingOrder.save();

    // Emit an event saying this was cancelled!
    new OrderCancelledPublisher(this.client).publish({
      id: existingOrder.id,
      userId: existingOrder.userId,
      status: existingOrder.status,
      version: existingOrder.version,
      ticket: {
        id: existingOrder.ticket.id,
      },
    });

    msg.ack();
  }
}
