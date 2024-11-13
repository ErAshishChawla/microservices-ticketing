import { z } from "zod";
import mongoose from "mongoose";

export const createPaymentSchema = z.object({
  orderId: z
    .string()
    .min(1, "Order Id must be provided")
    .refine((orderId) => {
      return mongoose.isValidObjectId(orderId);
    }, "Invalid Order Id"),
  stripeToken: z.string().min(1, "Stripe token must be provided"),
});

export type CreatePaymentValues = z.infer<typeof createPaymentSchema>;
