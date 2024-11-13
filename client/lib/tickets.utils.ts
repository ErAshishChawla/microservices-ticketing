import { type headers } from "next/headers";
import { buildClient, buildClientServer } from "./axios.utils";
import { CreateTicketValues } from "./zod.schemas";

export async function getTickets(
  headerFn: typeof headers,
  page: number = 1,
  limit: number = 10
) {
  const handler = buildClientServer(headerFn);

  const config = {
    method: "GET",
    url: `/api/tickets?page=${page}&limit=${limit}`,
  };

  return await handler(config);
}

export async function createTicket(values: CreateTicketValues) {
  const handler = buildClient();

  const config = {
    method: "POST",
    url: "/api/tickets",
    data: values,
  };

  return await handler(config);
}

export async function getTicket(headersFn: typeof headers, ticketId: string) {
  const handler = buildClientServer(headersFn);

  const config = {
    method: "GET",
    url: `/api/tickets/${ticketId}`,
  };

  return await handler(config);
}
