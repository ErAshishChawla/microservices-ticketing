/*
any types in this file are already under declare global namespace
*/

declare interface ApiResponseError {
  message: string;
  field?: string;
}

declare interface ApiResponseAttrs {
  statusCode: number;
  data?: any;
  errors?: ApiResponseError[];
}

declare interface UserPayload {
  id: string;
  email: string;
}

namespace Express {
  declare interface Request {
    currentUser?: UserPayload;
  }
}
