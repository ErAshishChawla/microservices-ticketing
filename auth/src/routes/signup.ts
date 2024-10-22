import express, { Router } from "express";

import {
  DatabaseConnectionError,
  RequestValidationError,
} from "../lib/utils/errors";

import { signUpSchema } from "../lib/zod/utlis.zod";
const router = Router();

router.post("/api/users/signup", (req, res) => {
  const { email, password } = req?.body;

  const validationResult = signUpSchema.safeParse({ email, password });

  if (!validationResult.success) {
    throw new RequestValidationError(validationResult.error.errors);
  }

  console.log("Creating a user...");
  throw new DatabaseConnectionError();

  res.send("Sign up successful");
});

export { router as signupRouter };
