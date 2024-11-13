"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

import { createTicketSchema, CreateTicketValues } from "@/lib/zod.schemas";
import { createTicket } from "@/lib/tickets.utils";
import { useToast } from "@/hooks/use-toast";
import { revalidateRoute } from "@/actions/revalidate.actions";

function CreateTicketForm() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<CreateTicketValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      price: "",
    },
  });
  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: CreateTicketValues) => {
    const createTicketRes = await createTicket(values);

    if (!createTicketRes.success) {
      const errors = createTicketRes.errors;
      errors?.forEach((error) =>
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      );

      return;
    }

    form.reset();
    toast({
      title: "Success",
      description: "Ticket created successfully.",
      variant: "default",
    });

    // Redirect to the ticket page
    await revalidateRoute("/");
    router.push("/?page=1");
  };

  return (
    <Card className="w-full max-w-96">
      <CardHeader>
        <CardTitle>Create Ticket</CardTitle>
        <CardDescription>Create your ticket with one click.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your ticket title. Make it unique and descriptive.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (USD)</FormLabel>
                  <FormControl>
                    <Input placeholder="Price" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your ticket price. Make it 2 decimal places.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-row-reverse w-full">
        <Button
          disabled={isSubmitting}
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>Create Ticket</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CreateTicketForm;
