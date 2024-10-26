/**
 * @file auth.utils.ts
 * @description This file contains utility functions related to authentication for the client-side of the ticketing microservices application.
 * It includes a function to handle user signup by making a POST request to the signup route and returning the API response.
 *
 * We make a request, if server is up and running, we will always get a response, even if the request is invalid.
 * If the server is down or route is not found, we dont want to tell the user that the server is down or the route is not found. We just show a generic error message.
 */

import { type headers } from "next/headers";

import { SigninValues, SignupValues } from "./zod.schemas";
import { externalApiRoutes, internalApiRoutes } from "./routes";
import { buildClient, buildClientServer } from "./axios.utils";
import { HttpMethods } from "./types.utils";

export const signup = async (values: SignupValues) => {
  const handler = buildClient();
  const config = {
    method: HttpMethods.POST,
    url: externalApiRoutes.signup(),
    data: values,
  };

  return await handler(config);
};

export const signin = async (values: SigninValues) => {
  const handler = buildClient();
  const config = {
    method: HttpMethods.POST,
    url: externalApiRoutes.signin(),
    data: values,
  };

  return await handler(config);
};

export const signout = async () => {
  const handler = buildClient();
  const config = {
    method: HttpMethods.POST,
    url: externalApiRoutes.signout(),
  };

  return await handler(config);
};

export const getCurrentUser = async (headerFn: typeof headers) => {
  const handler = buildClientServer(headerFn);
  const config = {
    method: HttpMethods.GET,
    url: internalApiRoutes.currentUser(),
  };

  const getCurrentUserRes = await handler(config);

  if (!getCurrentUserRes.success || !getCurrentUserRes?.data) {
    return null;
  }

  const currentUser = getCurrentUserRes.data;

  return currentUser as UserPayload;
};
