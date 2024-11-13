import nats, { Stan, StanOptions } from "node-nats-streaming";

export class NatsWrapper {
  private static _client?: Stan;

  private constructor() {}

  static connect(clusterId: string, clientId: string, options?: StanOptions) {
    if (NatsWrapper._client) {
      throw new Error("NATS client already exists");
    }

    const client = nats.connect(clusterId, clientId, options);

    return new Promise<void>((resolve, reject) => {
      client.on("connect", () => {
        console.log("Connected to NATS");

        // Assign the client to the static property
        NatsWrapper._client = client;

        resolve();
      });

      client.on("error", (err) => {
        reject(err);
      });
    });
  }

  static get stan() {
    if (!NatsWrapper._client) {
      throw new Error("Cannot access NATS client before connecting");
    }

    return NatsWrapper._client;
  }
}
