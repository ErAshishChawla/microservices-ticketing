/*
This file signs up a new user.

Flow:
1. Extract the email and password from the request body.
2. Validate the email and password.
3. If the email or password is invalid, throw a RequestValidationError.
4. Get the User Model.
5. Check if a user with the email already exists.
6. If a user with the email already exists, throw a UserAlreadyRegistered.
7. Hash the password.
8. Create a new user.
9. Save the user to the database.
10. Generate a JWT.
11. Store the JWT in the cookies.
12. Send a response with the user and the JWT.
*/

import { Router } from "express";
import jwt from "jsonwebtoken";

import { User } from "../models/user";

import { BadRequestError, RequestValidationError } from "../lib/utils/errors";
import { signUpSchema } from "../lib/zod/utlis.zod";
import ApiResponse from "../lib/utils/api-response";
import { keys } from "../lib/utils/keys";
import { routeMap } from "./route-map";

const router = Router();

router.post(routeMap.signup(), async (req, res) => {
  // 1. Extract the email and password from the request body.
  const { email, password } = req?.body;

  // 2. Validate the email and password.
  const validationResult = signUpSchema.safeParse({ email, password });

  // 3. If the email or password is invalid, throw a RequestValidationError.
  if (!validationResult.success) {
    throw new RequestValidationError(validationResult.error.errors);
  }

  // 4. Get the User Model.
  const existingUser = await User.findOne({ email });

  // 6. If a user with the email already exists, throw a UserAlreadyExistsError.
  if (existingUser) {
    throw new BadRequestError("User already registered");
  }

  // 8. Create a new user. User model hashes the password before storing it.
  const user = await User.build({ email, password }).save();

  // 10. Generate a JWT.
  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    keys.jwtKey!
  );

  // Store it on session object
  req.session = {
    jwt: userJwt,
  };

  return res.status(201).send(
    new ApiResponse({
      statusCode: 201,
      data: user,
    })
  );
});

export { router as signupRouter };
