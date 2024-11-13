import { Message } from "node-nats-streaming";
import {
  Listener,
  OrderCancelledEvent,
  Subjects,
} from "@eractickets/ticketing-common";

import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    console.log("Event data!", data);

    // 1. Find the order
    const order = await Order.findByEvent(data);

    if (!order) {
      throw new Error("Order not found");
    }

    // 2. Update the order status
    order.set({ status: data.status });

    // 3. Save the order
    await order.save();

    msg.ack();
  }
}
