import Stripe from "stripe";

import { keys } from "./lib/keys";

const stripe = new Stripe(keys.stripeKey!, {
  apiVersion: "2024-10-28.acacia",
});

export { stripe };
