declare interface ApiResponseError {
  message: string;
  field?: string;
}

declare interface ApiResponseAttrs {
  statusCode: number;
  data?: any;
  errors?: ApiResponseError[];
}
