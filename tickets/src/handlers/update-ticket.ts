// Purpose: Handler for updating a ticket in the database.

// 1. Extract the title, price, and ticketId from the request body.
// 2. Validate id, if it is not a valid MongoDB id, throw an error.
// 3. Extract title and price from the request body.
// 4. Find the ticket in the database using the ticketId.
// 5. If the ticket is not found, throw a NotFoundError.
// 6. CHeck if ticket belongs to the user
// 7. Update the ticket with the new title and price.
// 8. Save the updated ticket to the database.
// 9. Emit a TicketUpdated event.
// 10. Return the updated ticket as a response to the user.

import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  ApiResponse,
  BadRequestError,
  NotFoundError,
  RequestValidationError,
  UnauthorizedError,
} from "@eractickets/ticketing-common";

import { Ticket } from "../models/ticket";

import { createTicketSchema } from "../lib/zod.utils";
import { NatsWrapper } from "../lib/nats-wrapper.utils";
import { TicketUpdatedPublisher } from "../lib/events/publisher/ticket-updated-publisher";

export async function updateTicket(req: Request, res: Response) {
  const currentUser = req.currentUser!;
  const incomingId = req?.params?.id;

  if (!incomingId) {
    throw new BadRequestError("Ticket ID is required");
  }

  // Validate the ticket ID
  if (!mongoose.isValidObjectId(incomingId)) {
    throw new BadRequestError("Invalid ticket ID");
  }

  const { title: incomingTitle, price: incomingPrice } = req?.body;

  // Validate the title and price
  const validationResult = await createTicketSchema.safeParseAsync({
    title: incomingTitle,
    price: incomingPrice,
  });

  // If the validation fails, throw a RequestValidationError
  if (!validationResult.success) {
    const error = validationResult.error.errors;
    throw new RequestValidationError(error);
  }

  const existingTicket = await Ticket.findById(incomingId);

  if (!existingTicket) {
    throw new NotFoundError();
  }

  // Check if the ticket belongs to the user
  if (existingTicket.userId !== currentUser.id) {
    throw new UnauthorizedError();
  }

  existingTicket.set({
    title: incomingTitle,
    price: incomingPrice,
  });

  const updatedTicket = await existingTicket.save();

  await new TicketUpdatedPublisher(NatsWrapper.stan).publish({
    id: updatedTicket.id,
    title: updatedTicket.title,
    price: updatedTicket.price,
    userId: updatedTicket.userId,
  });

  return res.status(200).send(
    new ApiResponse({
      statusCode: 200,
      data: updatedTicket.toJSON(),
    })
  );
}
