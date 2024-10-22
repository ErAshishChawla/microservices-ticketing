declare interface ApiResponseData {
  [key: string]: any;
}

declare interface ApiResponseError {
  message: string;
  field?: string;
}

declare interface ApiResponseAttrs {
  statusCode: number;
  data?: ApiResponseData;
  errors?: ApiResponseError[];
}
