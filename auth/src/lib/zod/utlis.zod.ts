import { z, ZodError } from "zod";

export const signUpSchema = z.object({
  email: z
    .string({
      message: "Email must be a string",
    })
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email({
      message: "Invalid email address",
    }),
  password: z
    .string({
      message: "Password must be a string",
    })
    .trim()
    .min(4, "Password must be atleast 4 characters")
    .max(20, "Password must be at most 20 characters"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z
    .string({
      message: "Email must be a string",
    })
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email({
      message: "Invalid email address",
    }),
  password: z
    .string({
      message: "Password must be a string",
    })
    .trim()
    .min(1, "Password is required"),
});

export type SignInValues = z.infer<typeof signInSchema>;

export const formatZodErrors = (error: ZodError) => {
  const formattedErrors: Record<string, string[]> = {};
  const { fieldErrors } = error.flatten();

  for (const [field, errors] of Object.entries(fieldErrors)) {
    if (!errors) {
      continue;
    }
    formattedErrors[field] = errors;
  }

  return formattedErrors;
};
