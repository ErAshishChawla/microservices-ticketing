import { z } from "zod";

export const signupSchema = z.object({
  email: z
    .string({
      message: "Invalid email",
    })
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({
      message: "Invalid password",
    })
    .trim()
    .min(4, "Password must be at least 4 characters")
    .max(20, "Password must be at most 20 characters"),
});

export type SignupValues = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
  email: z
    .string({
      message: "Invalid email",
    })
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({
      message: "Invalid password",
    })
    .trim()
    .min(1, "Password is required"),
});
export type SigninValues = z.infer<typeof signinSchema>;

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
    .regex(
      /^\d+(\.\d{2})?$/,
      "Price must be a valid number and have 2 decimal places"
    ),
});
export type CreateTicketValues = z.infer<typeof createTicketSchema>;

export const createOrderSchema = z.object({
  ticketId: z
    .string({ message: "Invalid ticketId" })
    .trim()
    .min(1, "TicketId is required"),
});
export type CreateOrderValues = z.infer<typeof createOrderSchema>;

export const createPaymentSchema = z.object({
  orderId: z.string().min(1, "Order Id must be provided"),
  stripeToken: z.string().min(1, "Stripe token must be provided"),
});

export type CreatePaymentValues = z.infer<typeof createPaymentSchema>;
