/**
 * Abstract class representing a custom error.
 * All custom error classes should extend this class.
 */
abstract class CustomError extends Error {
  /**
   * The HTTP status code associated with the error.
   */
  abstract statusCode: number;

  /**
   * Constructs a new `CustomError` instance.
   * @param message - The error message.
   */
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  /**
   * Serializes the error into a format suitable for API responses.
   * @returns An array of `ApiResponseError` objects.
   */
  abstract serializeError(): ApiResponseError[];
}

/**
 * Class representing an internal server error.
 * Extends the `CustomError` class.
 */
export class InternalServerError extends CustomError {
  /**
   * The HTTP status code for internal server errors (500).
   */
  statusCode = 500;

  /**
   * Constructs a new `InternalServerError` instance.
   */
  constructor() {
    super("Internal Server Error");

    Object.setPrototypeOf(this, InternalServerError.prototype);
  }

  /**
   * Serializes the error into a format suitable for API responses.
   * @returns An array containing a single `ApiResponseError` object with a generic error message.
   */
  serializeError() {
    return [
      { message: "Uh oh! Something went wrong. Please try again later." },
    ];
  }
}
