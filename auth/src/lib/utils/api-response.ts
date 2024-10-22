export class ApiResponse {
  statusCode: number;
  errors?: ApiResponseError[];
  data?: ApiResponseData;
  success: boolean;

  constructor({ statusCode, errors, data }: ApiResponseAttrs) {
    this.statusCode = statusCode;
    this.errors = errors;
    this.data = data;
    this.success = statusCode >= 200 && statusCode < 300;
  }

  get JSON() {
    return {
      statusCode: this.statusCode,
      errors: this.errors,
      data: this.data,
      success: this.success,
    };
  }
}

export default ApiResponse;
