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
