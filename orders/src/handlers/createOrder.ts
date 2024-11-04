import { Request, Response } from "express";

import { CreateOrderValues, createOrderSchema } from "../lib/utils/zod.utils";
import { RequestValidationError } from "@eractickets/ticketing-common";

export async function createOrder(req: Request, res: Response) {
  const { incomingTicketId } = req?.body;

  const validationResult = await createOrderSchema.safeParseAsync({
    ticketId: incomingTicketId,
  });

  if (!validationResult.success) {
    const errors = validationResult.error.errors;
    throw new RequestValidationError(errors);
  }

  const { ticketId } = validationResult.data;
}
