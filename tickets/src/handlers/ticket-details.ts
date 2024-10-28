/*
This file will be responsible for getting ticket details. It will find a ticket by its id and return the ticket details.

1. extract incoming ticket id from the request parameters
2. If the ticket id is not provided, we throw a BadRequestError
3. Check if id is a valid mongoose id
4. If id is not valid, we throw a BadRequestError
5. Find the ticket by its id
6. if ticket is not found, we throw a NotFoundError
*/

import { Request, Response } from "express";
import {
  ApiResponse,
  BadRequestError,
  NotFoundError,
} from "@eractickets/ticketing-common";

import { Ticket } from "../models/ticket";
import mongoose from "mongoose";

export const ticketDetails = async (req: Request, res: Response) => {
  // Extract the id from the request parameters
  const incomingTicketId = req.params?.id;

  // If the ticket id is not provided, we throw a BadRequestError
  if (!incomingTicketId) {
    throw new BadRequestError("Ticket id is required");
  }

  // Check if id is a valid mongoose id
  const isValidId = mongoose.isValidObjectId(incomingTicketId);

  // If id is not valid, we throw a BadRequestError
  if (!isValidId) {
    throw new BadRequestError("Invalid ticket id");
  }

  // Find the ticket by its id
  const ticket = await Ticket.findById(incomingTicketId);

  if (!ticket) {
    throw new NotFoundError();
  }

  return res.status(200).send(
    new ApiResponse({
      statusCode: 200,
      data: ticket.toJSON(),
    })
  );
};
