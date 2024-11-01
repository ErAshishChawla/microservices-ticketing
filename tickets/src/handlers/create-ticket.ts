/*
This file will be responsible for creating a new ticket. It will validate the incoming request body and then create a new ticket in the database.

1. Extract the title and price from the incoming request body.
2. Validate the incoming request body using the createTicketSchema.
3. If the validation fails, throw a RequestValidationError with the errors.
4. If the validation passes, create a new ticket
5. Publish a TicketCreated event
*/

import { Request, Response } from "express";
import {
  ApiResponse,
  RequestValidationError,
} from "@eractickets/ticketing-common";

import { Ticket } from "../models/ticket";

import { createTicketSchema } from "../lib/zod.utils";
import { TicketCreatedPublisher } from "../lib/events/publisher/ticket-created-publisher";
import { NatsWrapper } from "../lib/nats-wrapper.utils";

export const createTicket = async (req: Request, res: Response) => {
  const currentUser = req.currentUser!;
  // Extract the title and price from the incoming request body
  const { title: incomingTitle, price: incomingPrice } = req?.body;

  // Validate the incoming request body
  const validationResults = await createTicketSchema.safeParseAsync({
    title: incomingTitle,
    price: incomingPrice,
  });

  // If the validation fails, throw a RequestValidationError with the errors
  if (!validationResults.success) {
    const errors = validationResults.error.errors;
    throw new RequestValidationError(errors);
  }

  // If the validation passes, create a new ticket
  const { title, price } = validationResults.data;

  // Create a new ticket
  const newTicket = Ticket.build({
    title,
    price,
    userId: currentUser.id,
  });
  await newTicket.save();

  const stan = NatsWrapper.stan;
  await new TicketCreatedPublisher(stan).publish({
    id: newTicket.id,
    title: newTicket.title,
    price: newTicket.price,
    userId: newTicket.userId,
  });
  const ticket = newTicket.toJSON();

  return res.status(201).send(
    new ApiResponse({
      statusCode: 201,
      data: ticket,
    })
  );
};
