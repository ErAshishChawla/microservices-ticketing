import Queue from "bull";
import { keys } from "../lib/keys";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { NatsWrapper } from "../lib/nats-wrapper.utils";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: keys.redisHost,
  },
});

expirationQueue.process(async (job) => {
  console.log(
    "Publish an expiration:complete event for orderId",
    job.data.orderId
  );

  const nats = NatsWrapper.stan;
  // Publish an event to the NATS server.
  new ExpirationCompletePublisher(nats).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
