/**
 * @file axios.utils.ts
 * @description This file contains utility functions for making API requests using Axios.
 * It includes a function `sendApiRequest` that handles HTTP requests with error handling.
 */
import axios, { AxiosError } from "axios";

import ApiResponse from "./api-response";
import { InternalServerError } from "./errors.utils";
import { HttpMethods } from "./types.utils";

export const sendExternalApiRequest = async (
  method: HttpMethods,
  route: string,
  data?: any
) => {
  try {
    const config = {
      method: method,
      url: route,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    };
    const res = (await axios(config))?.data as ApiResponseJson;

    return res;
  } catch (error) {
    console.log("Error: ", error);
    if (error instanceof AxiosError) {
      const res = error.response?.data as ApiResponseJson | undefined;
      if (res) {
        return res;
      }
    }

    const err = new InternalServerError();
    return new ApiResponse({
      statusCode: err.statusCode,
      errors: err.serializeError(),
    }).JSON;
  }
};
