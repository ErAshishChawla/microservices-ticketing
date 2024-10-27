/*
This file is responsible for handling the sign in route.

Flow:
1. extract the email and password from the request body
2. validate the email and password
3. check if the user exists
4. compare the password
5. generate a JWT
6. Assign the JWT to the session object
7. Send the response
*/

import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";

import { User } from "../models/user";

import { signInSchema } from "../lib/zod/utlis.zod";
import { BadRequestError, RequestValidationError } from "../lib/utils/errors";
import { routeMap } from "./route-map";
import { keys } from "../lib/utils/keys";
import ApiResponse from "../lib/utils/api-response";

const router = Router();

router.post(routeMap.signin(), async (req: Request, res: Response) => {
  // 1. extract the email and password from the request body
  const { email: incomingEmail, password: incomingPassword } = req?.body;

  // 2. validate the email and password
  const validationResult = await signInSchema.safeParseAsync({
    email: incomingEmail,
    password: incomingPassword,
  });

  if (!validationResult.success) {
    const errors = validationResult.error.errors;
    throw new RequestValidationError(errors);
  }

  const { email, password } = validationResult.data;

  // 3. check if the user exists
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    console.log("User not found");
    throw new BadRequestError("Invalid credentials");
  }

  // 4. compare the password
  const passwordsMatch = await User.comparePassword(
    password,
    existingUser.password
  );

  if (!passwordsMatch) {
    console.log("Passwords do not match");
    throw new BadRequestError("Invalid credentials");
  }

  // 5. generate a JWT
  const userJwt = jwt.sign(
    {
      id: existingUser.id,
      email: existingUser.email,
    },
    keys.jwtKey!
  );

  // 6. Assign the JWT to the session object
  req.session = {
    jwt: userJwt,
  };

  return res.status(200).send(
    new ApiResponse({
      statusCode: 200,
      data: existingUser,
    })
  );
});

export { router as signinRouter };
