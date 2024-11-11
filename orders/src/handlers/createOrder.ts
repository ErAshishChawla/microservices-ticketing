import { Request, Response } from "express";
import { DateTime } from "luxon";
import {
  ApiResponse,
  BadRequestError,
  NotFoundError,
  OrderStatus,
  RequestValidationError,
} from "@eractickets/ticketing-common";

import { Ticket } from "../models/ticket";
import { Order } from "../models/order";

import { createOrderSchema } from "../lib/utils/zod.utils";
import { keys } from "../lib/keys";
import { NatsWrapper } from "../lib/utils/nats-wrapper.utils";
import { OrderCreatedPublisher } from "../lib/utils/events/publishers/order-created-publisher";

export async function createOrder(req: Request, res: Response) {
  const { ticketId: incomingTicketId } = req?.body;

  const validationResult = await createOrderSchema.safeParseAsync({
    ticketId: incomingTicketId,
  });

  if (!validationResult.success) {
    const errors = validationResult.error.errors;
    throw new RequestValidationError(errors);
  }

  const { ticketId } = validationResult.data;

  // Once we have a valid ticketId, we need to check if the ticket exists
  const existingTicket = await Ticket.findById(ticketId);

  if (!existingTicket) {
    throw new NotFoundError();
  }

  // Check if the ticket is already reserved.
  // Run query to look at all orders. Find an order where the ticket is not cancelled.
  // If we find an order from this condition, it means ticket is reserved.
  const isReserved = await existingTicket.isReserved();

  if (isReserved) {
    throw new BadRequestError("Ticket is already reserved");
  }

  // Calculate an expiration for this order
  const expiration = DateTime.utc()
    .plus({ minutes: keys.expirationWindowMinutes })
    .toJSDate();

  // Build an order and save it to the database
  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket: existingTicket,
  });

  await order.save();

  // Publish an event saying that an order was created
  const nats = NatsWrapper.stan;
  new OrderCreatedPublisher(nats).publish({
    id: order.id,
    status: order.status,
    userId: order.userId,
    expiresAt: order.expiresAt.toISOString(),
    version: order.version,
    ticket: {
      id: existingTicket.id,
      price: existingTicket.price,
    },
  });

  // Respond to the request indicating that the order was created
  return res
    .status(201)
    .send(new ApiResponse({ statusCode: 201, data: order }));
}
