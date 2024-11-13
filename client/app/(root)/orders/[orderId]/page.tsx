import React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getOrderDetails } from "@/lib/orders.utils";
import PayForOrderForm from "@/components/pay-for-order-form";
import { getCurrentUser } from "@/lib/auth.utils";

interface OrderDetailsPageProps {
  params: {
    orderId: string;
  };
}

async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const currentUser = await getCurrentUser(headers);

  const { orderId } = params;

  if (!orderId) {
    redirect("/orders");
  }

  const orderDetailsRes = await getOrderDetails(headers, orderId);

  if (!orderDetailsRes.success) {
    redirect("/orders");
  }

  const orderDetails = orderDetailsRes.data as Order;

  return (
    <section className="w-full h-full">
      <ScrollArea className="w-full h-full">
        <div className="w-full h-full p-8 flex flex-col items-center">
          <div className="w-full max-w-96">
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>
                  These are the details of the selected order.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div>
                    <span className="font-semibold">Order ID:</span>{" "}
                    {orderDetails.id}
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>{" "}
                    {orderDetails.status}
                  </div>
                  <div>
                    <span className="font-semibold">Price:</span>{" "}
                    {orderDetails.ticket.price}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex">
                <PayForOrderForm order={orderDetails} user={currentUser} />
              </CardFooter>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </section>
  );
}

export default OrderDetailsPage;
