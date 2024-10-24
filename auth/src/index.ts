import express, { Request, Response } from "express";
import { json } from "body-parser";
import "express-async-errors";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./lib/utils/errors/not-found-error";

import { keys } from "./lib/utils/keys";

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

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.use(async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  const MAX_RETRIES = 5;
  const { mongoURI } = keys;

  // Check if all the required environment variables are set.
  Object.values(keys).forEach((value) => {
    if (!value) {
      throw new Error("Missing environment variable");
    }
  });

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      await mongoose.connect(mongoURI);
      mongoose.connection.on("error", (error) => {
        console.log("Connection to MongoDB failed: ", error);
      });
      console.log("Connected to MongoDB...");
      break;
    } catch (error) {
      console.log("Error connecting to MongoDB: ", error);
      console.log("Retrying in 5 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
};

start();
