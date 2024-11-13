"use client";

import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { revalidateRoute } from "@/actions/revalidate.actions";
import { createOrder } from "@/lib/orders.utils";

interface CreateOrderFormProps {
  ticketId: string;
}

function CreateOrderForm({ ticketId }: CreateOrderFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm();
  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async () => {
    if (!ticketId) {
      toast({
        title: "Ticket not found",
        description: "The ticket you are trying to order does not exist",
        variant: "destructive",
      });
      return;
    }

    // create an order
    const createOrderRes = await createOrder({ ticketId });

    if (!createOrderRes.success) {
      console.log(createOrderRes);
      const errors = createOrderRes.errors;
      errors?.forEach((error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      });

      return;
    }

    toast({
      title: "Order created",
      description: "Your order has been created successfully",
    });

    const orderDetails = createOrderRes.data as Order;

    // invalidate the cache
    await revalidateRoute(`/tickets/${ticketId}`);
    // redirect to the order page
    router.push(`/orders/${orderDetails.id}`);
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Button disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        <span>Buy Ticket</span>
      </Button>
    </form>
  );
}

export default CreateOrderForm;
