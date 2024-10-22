export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    // message is just for logging purposes
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeError(): ApiResponseError[];
}
