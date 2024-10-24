/* 
This route is responsible for returning the current user.

Flow:
1. Check if req has a session object with jwt.
2. Extract the jwt from the session object and decode it.
*/

import { Router } from "express";

import { routeMap } from "./route-map";
import ApiResponse from "../lib/utils/api-response";
import { currentUser } from "../middlewares/current-user";

const router = Router();

router.get(routeMap.currentUser(), currentUser, (req, res) => {
  return res.status(200).send(
    new ApiResponse({
      statusCode: 200,
      data: req.currentUser || null,
    })
  );
});

export { router as currentUserRouter };
