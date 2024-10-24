/*
This middleware will be used to check if the user is logged in or not. If the user is logged in, we will set the currentUser property on the request object. If the user is not logged in, we will set the currentUser property to null.
*/

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { keys } from "../lib/utils/keys";

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    console.log("No session jwt");
    return next();
  }

  try {
    const payload = jwt.verify(req.session.jwt, keys.jwtKey!) as UserPayload;

    req.currentUser = payload;
  } catch (error) {}

  next();
};
