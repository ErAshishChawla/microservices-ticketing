import React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import CreateOrderForm from "@/components/create-order-form";

import { getTicket } from "@/lib/tickets.utils";

interface TicketDetailsPageProps {
  params: {
    ticketId: string;
  };
}

async function TicketDetailsPage({ params }: TicketDetailsPageProps) {
  const ticketId = params.ticketId;

  if (!ticketId) {
    redirect("/");
  }

  const ticketDetailsRes = await getTicket(headers, ticketId);

  if (!ticketDetailsRes.success) {
    redirect("/");
  }

  const ticketDetails = ticketDetailsRes.data as Ticket;

  return (
    <section className="w-full h-full">
      <ScrollArea className="w-full h-full">
        <div className="w-full h-full flex flex-col p-8 items-center">
          <div className="w-full max-w-96">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Details</CardTitle>
                <CardDescription>
                  These are the details of the selected ticket.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div>
                    <span className="font-semibold">Title:</span>{" "}
                    {ticketDetails.title}
                  </div>
                  <div>
                    <span className="font-semibold">Price:</span>{" "}
                    {ticketDetails.price}
                  </div>
                  <div>
                    <span>
                      <span className="font-semibold">Status:</span>{" "}
                      {ticketDetails.orderId ? "Unavailable" : "Available"}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-row-reverse">
                <CreateOrderForm ticketId={ticketId} />
              </CardFooter>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </section>
  );
}

export default TicketDetailsPage;
