"use client";

import React, { useEffect, useRef, useState } from "react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { revalidateRoute } from "@/actions/revalidate.actions";
import StripeCheckout from "react-stripe-checkout";
import { createPayment } from "@/lib/payments.utils";
import { useToast } from "@/hooks/use-toast";

interface PayForOrderFormProps {
  order: Order;
  user?: UserPayload | null;
}

function PayForOrderForm({ order, user }: PayForOrderFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const [timeLeft, setTimeLeft] = useState("");

  const [paymentLoading, setPaymentLoading] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const findTimeLeft = async () => {
      const expiryUtcDate = DateTime.fromISO(order.expiresAt);
      const currentUtc = DateTime.utc();

      const diff = expiryUtcDate.diff(currentUtc);
      const secondsLeft = diff.milliseconds / 1000;

      if (secondsLeft <= 0) {
        setTimeLeft("Order Expired");
        await revalidateRoute(`/orders/${order.id}`);
        await revalidateRoute("/orders");
        await revalidateRoute("/tickets");
        await revalidateRoute(`/tickets/${order.ticket.id}`);
        router.refresh();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        return;
      }

      const minutes = Math.floor(secondsLeft / 60);
      const seconds = Math.floor(secondsLeft % 60);

      setTimeLeft(`${minutes}m ${seconds}s`);
    };

    // run the function once
    findTimeLeft();

    // run the function every second
    intervalRef.current = setInterval(findTimeLeft, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex justify-center text-gray-600 text-xs">
        Expires in: {timeLeft}
      </div>
      {timeLeft !== "Order Expired" && (
        <div className="w-full flex flex-col items-center gap-3 justify-center">
          {paymentLoading && <div>Loading...</div>}
          <StripeCheckout
            token={async (token) => {
              setPaymentLoading(true);
              const createPaymentRes = await createPayment({
                orderId: order.id,
                stripeToken: token.id,
              });

              if (!createPaymentRes.success) {
                const errors = createPaymentRes.errors;
                errors?.forEach((error) => {
                  toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                  });
                });
                setPaymentLoading(false);
              }

              toast({
                title: "Payment successful",
                description: "Your payment has been processed successfully",
              });

              await revalidateRoute(`/orders/${order.id}`);
              await revalidateRoute("/orders");
              await revalidateRoute("/tickets");
              router.push("/orders");
              setPaymentLoading(false);
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
              }
            }}
            stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
            amount={Number(order.ticket.price) * 100}
            email={user?.email}
          />
        </div>
      )}
    </div>
  );
}

export default PayForOrderForm;
