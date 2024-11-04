import express, { Request, Response } from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@eractickets/ticketing-common";

import { ordersRouter } from "./routes/orders";

const app = express();
// Traffic is being proxied to our app through ingress-nginx. By default express does not trust the proxy and will not accept https requests. We need to tell express to trust the proxy.
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);
app.use((req: Request, res: Response, next) => {
  console.log("Request details: ", req.method, req.path);
  next();
});

app.use(currentUser);

app.use(ordersRouter);

app.use(async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
