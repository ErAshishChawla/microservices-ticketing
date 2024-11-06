import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  ApiResponse,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@eractickets/ticketing-common";

import { Order } from "../models/order";

export async function getOrderDetails(req: Request, res: Response) {
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
    throw new NotFoundError();
  }

  if (order.userId !== currentUser!.id) {
    throw new UnauthorizedError();
  }

  return res.status(200).send(
    new ApiResponse({
      statusCode: 200,
      data: order.toJSON(),
    })
  );
}
