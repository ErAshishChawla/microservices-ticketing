import express, { Router } from "express";

import { routeMap } from "./route-map";
import ApiResponse from "../lib/utils/api-response";

const router = Router();

router.post(routeMap.signout(), (req, res) => {
  req.session = null;

  return res.status(200).send(new ApiResponse({ statusCode: 200 }));
});

export { router as signoutRouter };
