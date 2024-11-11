import crypto from "crypto";

import { keys } from "./lib/keys";
import { NatsWrapper } from "./lib/nats-wrapper.utils";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const start = async () => {
  const { natsHost, natsPort } = keys;

  // Check if all the required environment variables are set.
  Object.entries(keys).forEach(([key, value]) => {
    if (!value) {
      throw new Error(`Environment variable ${key} is not set`);
    }
  });

  while (true) {
    try {
      await NatsWrapper.connect(
        "ticketing",
        crypto.randomBytes(4).toString("hex"),
        {
          url: `http://${natsHost}:${natsPort}`,
        }
      );

      const stan = NatsWrapper.stan;
      stan.on("close", () => {
        console.log("NATS connection closed");
        process.exit();
      });
      process.on("SIGINT", () => stan.close());
      process.on("SIGTERM", () => stan.close());

      new OrderCreatedListener(stan).listen();
      break;
    } catch (error) {
      console.log("Error connecting to NATS: ", error);
      console.log("Retrying in 5 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

start();
