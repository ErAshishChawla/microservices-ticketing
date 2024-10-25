/**
 * @file axios.utils.ts
 * @description This file contains utility functions for making API requests using Axios.
 * It includes a function `sendApiRequest` that handles HTTP requests with error handling.
 */
import axios, { Axios, AxiosError } from "axios";

import ApiResponse from "./api-response";
import { InternalServerError } from "./errors.utils";
import { HttpMethods } from "./types.utils";

export const sendApiRequest = async (
  method: HttpMethods,
  route: string,
  data?: any
) => {
  try {
    const res = (
      await axios[method](route, data, {
        timeout: 10000,
      })
    )?.data as ApiResponse;

    return res;
  } catch (error) {
    if (error instanceof AxiosError) {
      const res = error.response?.data as ApiResponse | undefined;
      if (res) {
        return res;
      }
    }

    const err = new InternalServerError();
    return new ApiResponse({
      statusCode: err.statusCode,
      errors: err.serializeError(),
    });
  }
};
