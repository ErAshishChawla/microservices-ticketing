import { buildClient } from "./axios.utils";
import { CreatePaymentValues } from "./zod.schemas";

export async function createPayment(data: CreatePaymentValues) {
  const handler = buildClient();

  const config = {
    url: "/api/payments/charge",
    method: "post",
    data,
  };

  return handler(config);
}
