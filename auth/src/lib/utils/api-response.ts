export class ApiResponse {
  status: number;
  errors?: ApiResponseError[];
  data?: ApiResponseData;
  success: boolean;

  constructor(
    status: number,
    errors?: ApiResponseError[],
    data?: ApiResponseData
  ) {
    this.status = status;
    this.errors = errors;
    this.data = data;
    this.success = status >= 200 && status < 300;
  }

  get JSON() {
    return {
      status: this.status,
      errors: this.errors,
      data: this.data,
      success: this.success,
    };
  }
}

export default ApiResponse;
