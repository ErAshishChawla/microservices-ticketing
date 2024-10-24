import mongoose from "mongoose";

import { app } from "./app";
import { keys } from "./lib/utils/keys";

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
