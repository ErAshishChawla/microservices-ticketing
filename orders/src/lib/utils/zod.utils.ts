import mongoose from "mongoose";
import { z } from "zod";

export const createOrderSchema = z.object({
  ticketId: z
    .string({
      invalid_type_error: "Ticket ID must be a string",
    })
    .min(1, "Ticket Id is required")

    .refine((data: string) => {
      return mongoose.isValidObjectId(data);
    }, "Invalid Ticket ID"),
});

export type CreateOrderValues = z.infer<typeof createOrderSchema>;
