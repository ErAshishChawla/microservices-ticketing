/* 
This route is responsible for returning the current user.

Flow:
1. Check if req has a session object with jwt.
2. Extract the jwt from the session object and decode it.
*/

import express, { Router } from "express";
import jwt from "jsonwebtoken";

import { routeMap } from "./route-map";
import ApiResponse from "../lib/utils/api-response";
import { keys } from "../lib/utils/keys";
import { UnauthorizedError } from "../lib/utils/errors/unauthorized-error";

const router = Router();

router.get(routeMap.currentUser(), (req, res) => {
  if (!req.session?.jwt) {
    return res.status(200).send(
      new ApiResponse({
        statusCode: 200,
        data: null,
      })
    );
  }

  try {
    const payload = jwt.verify(req.session.jwt, keys.jwtKey!);

    return res.status(200).send(
      new ApiResponse({
        statusCode: 200,
        data: payload,
      })
    );
  } catch (error) {
    return res.status(200).send(
      new ApiResponse({
        statusCode: 200,
        data: null,
      })
    );
  }
});

export { router as currentUserRouter };
