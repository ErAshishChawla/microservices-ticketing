import mongoose from "mongoose";
import crypto from "crypto";

import { app } from "./app";
import { keys } from "./lib/keys";
import { NatsWrapper } from "./lib/utils/nats-wrapper.utils";
import { TicketCreatedListener } from "./lib/utils/events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./lib/utils/events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./lib/utils/events/listeners/expiration-complete-listener";
import { PaymentCreatedListener } from "./lib/utils/events/listeners/payment-created-listener";
const start = async () => {
  try {
    const { mongoHost, mongoDb, mongoPort, natsHost, natsPort } = keys;

    // Check if all the required environment variables are set.
    Object.entries(keys).forEach(([key, value]) => {
      if (!value) {
        throw new Error(`Environment variable ${key} is not set`);
      }
    });

    while (true) {
      try {
        await mongoose.connect(
          `mongodb://${mongoHost}:${mongoPort}/${mongoDb}`
        );
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

        // Start listening for events
        new TicketCreatedListener(stan).listen();
        new TicketUpdatedListener(stan).listen();
        new ExpirationCompleteListener(stan).listen();
        new PaymentCreatedListener(stan).listen();

        break;
      } catch (error) {
        console.log("Error connecting to NATS: ", error);
        console.log("Retrying in 5 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    app.listen(3000, () => {
      console.log("Listening on port 3000");
    });
  } catch (error) {
    console.log("Error starting the app: ", error);
    process.exit(1);
  }
};

start();
