import { ZodIssue } from "zod";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  public statusCode = 400;
  constructor(public errors: ZodIssue[]) {
    super("Error validating request parameters");

    // This is only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeError(): ApiResponseError[] {
    return this.errors.map((error) => {
      return {
        message: error.message,
        field: error.path.join("."),
      };
    });
  }
}
