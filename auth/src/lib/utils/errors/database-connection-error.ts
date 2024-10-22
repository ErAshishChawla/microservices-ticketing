import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  public statusCode = 500;
  reason = "Error connecting to database";
  constructor() {
    super("Error connecting to database");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeError(): ApiResponseError[] {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
