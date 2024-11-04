import { Router } from "express";

import { routeMap } from "../lib/routeMap";
import {
  getAllOrders,
  getOrderDetails,
  createOrder,
  deleteOrder,
} from "../handlers";

const router = Router();

router.get(routeMap.allOrders(), getAllOrders);

router.post(routeMap.createOrder(), createOrder);

router.get(routeMap.getOrder(), getOrderDetails);

router.delete(routeMap.deleteOrder(), deleteOrder);

export { router as ordersRouter };
