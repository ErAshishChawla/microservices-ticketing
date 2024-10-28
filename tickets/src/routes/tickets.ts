import { Request, Response, Router } from "express";
import { requireAuth } from "@eractickets/ticketing-common";

import { routeMap } from "../lib/routeMap";
import {
  createTicket,
  updateTicket,
  allTickets,
  ticketDetails,
} from "../handlers";

const router = Router();

router.get(routeMap.allTickets(), allTickets);

router.get(routeMap.specificTicket(), ticketDetails);

router.post(routeMap.createTicket(), requireAuth, createTicket);

router.put(routeMap.updateTicket(), requireAuth, updateTicket);

export { router as ticketsRouter };
