import {
  PaymentCreatedEvent,
  Listener,
  Subjects,
  OrderStatus,
} from "@eractickets/ticketing-common";
import { Message } from "node-nats-streaming";

import { queueGroupName } from "./queue-group-name";
import { Order } from "../../../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    console.log("Event data", data);

    // 1. Find the order that the payment is associated with
    const existingOrder = await Order.findById(data.orderId);

    if (!existingOrder) {
      throw new Error("Order not found");
    }

    // 2. Update the order status to complete
    existingOrder.set({ status: OrderStatus.Complete });

    // 3. Save the order
    await existingOrder.save();

    msg.ack();
  }
}
