import mongoose from "mongoose";

import { app } from "./app";
import { keys } from "./lib/keys";

const start = async () => {
  const { mongoHost, mongoDb, mongoPort } = keys;

  // Check if all the required environment variables are set.
  Object.entries(keys).forEach(([key, value]) => {
    if (!value) {
      throw new Error(`Environment variable ${key} is not set`);
    }
  });

  while (true) {
    try {
      await mongoose.connect(`mongodb://${mongoHost}:${mongoPort}/${mongoDb}`);
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
