import { type headers } from "next/headers";
import { buildClient, buildClientServer } from "./axios.utils";
import { CreateOrderValues } from "./zod.schemas";

export async function createOrder(data: CreateOrderValues) {
  const handler = buildClient();

  const config = {
    url: "/api/orders",
    method: "post",
    data,
  };
  return handler(config);
}

export async function getOrderDetails(
  headerFn: typeof headers,
  orderId: string
) {
  const handler = buildClientServer(headerFn);

  const config = {
    url: `/api/orders/${orderId}`,
    method: "get",
  };
  return handler(config);
}

export async function getOrders(
  headerFn: typeof headers,
  page: number = 1,
  limit: number = 10
) {
  const handler = buildClientServer(headerFn);

  const config = {
    url: `/api/orders?page=${page}&limit=${limit}`,
    method: "get",
  };
  return handler(config);
}
