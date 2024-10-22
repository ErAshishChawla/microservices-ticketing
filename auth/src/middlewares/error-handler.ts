import { Request, Response, NextFunction } from "express";
import { CustomError } from "../lib/utils/errors";
import ApiResponse from "../lib/utils/api-response";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send(
      new ApiResponse({
        statusCode: err.statusCode,
        errors: err.serializeError(),
      }).JSON
    );
  }

  res.status(400).send(
    new ApiResponse({
      statusCode: 400,
      errors: [
        {
          message: "Something went wrong",
        },
      ],
    }).JSON
  );
};
