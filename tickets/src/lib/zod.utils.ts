import { z } from "zod";

export const createTicketSchema = z.object({
  title: z
    .string({ message: "Invalid Title" })
    .trim()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must be at most 100 characters long"),

  price: z
    .string({
      message: "Invalid price",
    })
    .trim()
    .regex(/^\d+(\.\d{2})?$/, "Price must be a valid number"),
});
export type CreateTicketValues = z.infer<typeof createTicketSchema>;
