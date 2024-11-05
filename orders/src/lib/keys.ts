export const keys = {
  mongoHost: process.env.MONGO_HOST,
  mongoDb: process.env.MONGO_DB,
  mongoPort: process.env.MONGO_PORT,
  natsHost: process.env.NATS_HOST,
  natsPort: process.env.NATS_PORT,
  expirationWindowMinutes: Number(process.env.EXPIRATION_WINDOW_MINUTES),
};
