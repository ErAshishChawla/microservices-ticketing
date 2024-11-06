import { Request, Response } from "express";
import {
  ApiResponse,
  BadRequestError,
  UnauthorizedError,
} from "@eractickets/ticketing-common";
import mongoose from "mongoose";

import { Order, OrderStatus } from "../models/order";

import { OrderCancelledPublisher } from "../lib/utils/events/publishers/order-cancelled-publisher";
import { NatsWrapper } from "../lib/utils/nats-wrapper.utils";

export async function deleteOrder(req: Request, res: Response) {
  const currentUser = req.currentUser;

  const incomingOrderId = req.params.orderId;

  if (!incomingOrderId) {
    throw new BadRequestError("Order ID is required");
  }

  const isValidOrderId = mongoose.isValidObjectId(incomingOrderId);

  if (!isValidOrderId) {
    throw new BadRequestError("Invalid Order ID");
  }

  // Find the order by its id
  const order = await Order.findById(incomingOrderId).populate("ticket");

  if (!order) {
    throw new BadRequestError("Order not found");
  }

  if (order.userId !== currentUser!.id) {
    throw new UnauthorizedError();
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  // Publish an event that the order has been cancelled.
  new OrderCancelledPublisher(NatsWrapper.stan).publish({
    id: order.id,
    status: order.status,
    ticket: {
      id: order.ticket.id,
    },
  });

  return res.status(204).send(new ApiResponse({ statusCode: 204 }));
}
