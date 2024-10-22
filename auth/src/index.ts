import express, { Request, Response } from "express";
import { json } from "body-parser";
import "express-async-errors";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./lib/utils/errors/not-found-error";

const app = express();
app.use(json());

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

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
