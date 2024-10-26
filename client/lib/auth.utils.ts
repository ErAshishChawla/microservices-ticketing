/**
 * @file auth.utils.ts
 * @description This file contains utility functions related to authentication for the client-side of the ticketing microservices application.
 * It includes a function to handle user signup by making a POST request to the signup route and returning the API response.
 *
 * We make a request, if server is up and running, we will always get a response, even if the request is invalid.
 * If the server is down or route is not found, we dont want to tell the user that the server is down or the route is not found. We just show a generic error message.
 */

import { SignupValues } from "./zod.schemas";
import { externalApiRoutes } from "./routes";
import { sendExternalApiRequest } from "./axios.utils";
import { HttpMethods } from "./types.utils";

export const signup = async (values: SignupValues) => {
  return sendExternalApiRequest(
    HttpMethods.POST,
    externalApiRoutes.signup(),
    values
  );
};
