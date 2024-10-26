"use server";

import { headers } from "next/headers";

import ApiResponse from "./api-response";
import { InternalServerError } from "./errors.utils";
import { HttpMethods } from "./types.utils";

export const sendInternalApiRequest = async (
  method: HttpMethods,
  route: string,
  data?: any
) => {
  try {
    const newHeaders: KeyValueObject = {};
    const headersList = headers();
    headersList.forEach((value, key) => {
      newHeaders[key] = value;
    });

    const config = {
      method: method,
      url: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
      headers: {
        ...newHeaders,
        "Content-Type": "application/json",
        Host: "ticketing.dev",
        "Custom-Header": "custom",
      },
    };

    const fetchRes = await fetch(config.url, {
      method: config.method,
      headers: config.headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    console.log(fetchRes);
    const res = await fetchRes.json();

    return res;
  } catch (error) {
    console.log("Error: ", error);
    const err = new InternalServerError();
    return new ApiResponse({
      statusCode: err.statusCode,
      errors: err.serializeError(),
    }).JSON;
  }
};
