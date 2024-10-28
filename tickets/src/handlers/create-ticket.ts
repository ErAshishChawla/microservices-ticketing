/*
This file will be responsible for creating a new ticket. It will validate the incoming request body and then create a new ticket in the database.

1. Extract the title and price from the incoming request body.
2. Validate the incoming request body using the createTicketSchema.
3. If the validation fails, throw a RequestValidationError with the errors.
4. If the validation passes, create a new ticket
*/

import { Request, Response } from "express";
import {
  ApiResponse,
  RequestValidationError,
} from "@eractickets/ticketing-common";

import { Ticket } from "../models/ticket";

import { createTicketSchema } from "../lib/zod.utils";

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
  const newTicket = await Ticket.build({
    title,
    price,
    userId: currentUser.id,
  }).save();

  const ticket = newTicket.toJSON();

  return res.status(201).send(
    new ApiResponse({
      statusCode: 201,
      data: ticket,
    })
  );
};
