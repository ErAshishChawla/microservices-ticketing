import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from "@eractickets/ticketing-common";
import { Message } from "node-nats-streaming";
import { DateTime } from "luxon";

import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = DateTime.fromISO(data.expiresAt)
      .diff(DateTime.utc())
      .as("milliseconds");
    console.log("Waiting this many milliseconds to process the job:", delay);

    await expirationQueue.add(
      { orderId: data.id },
      {
        delay,
      }
    );

    msg.ack();
  }
}
