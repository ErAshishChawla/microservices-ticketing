/**
 * @file axios.utils.ts
 * @description This file contains utility functions for making API requests using Axios.
 * It includes a function `sendApiRequest` that handles HTTP requests with error handling.
 */
import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
} from "axios";

import ApiResponse from "./api-response";
import { InternalServerError } from "./errors.utils";

import { type headers } from "next/headers";

export const handleRequest = async (
  client: AxiosInstance,
  config: AxiosRequestConfig
): Promise<ApiResponseJson> => {
  try {
    const response = (await client(config)).data as ApiResponseJson;

    return response;
  } catch (err) {
    console.log("Error: ", err);
    if (err instanceof AxiosError) {
      const res = err?.response?.data as ApiResponseJson;
      if (res) {
        return res;
      }
    }
    const error = new InternalServerError();
    return new ApiResponse({
      statusCode: error.statusCode,
      errors: error.serializeError(),
    }).JSON;
  }
};

export const buildClient = () => {
  const client = axios.create({
    baseURL: "/",
  });

  return <D>(config: AxiosRequestConfig<D>) => handleRequest(client, config);
};

export const buildClientServer = (headersFn: typeof headers) => {
  const requestHeaders = new AxiosHeaders();
  const headersList = headersFn();
  headersList.forEach((value, key) => {
    requestHeaders.set(key, value);
  });

  requestHeaders.set("host", "ticketing.dev");

  const client = axios.create({
    baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
    headers: requestHeaders,
  });

  return (config: AxiosRequestConfig) => handleRequest(client, config);
};
