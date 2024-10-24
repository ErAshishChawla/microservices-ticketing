import { CustomError } from "./custom-error";

export class UnauthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super("Unauthorized access");

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeError(): ApiResponseError[] {
    return [{ message: "Unauthorized access" }];
  }
}
