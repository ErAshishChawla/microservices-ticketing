"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { signout } from "@/lib/auth.utils";
import { clientRoutes } from "@/lib/routes";

function SignOutForm() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm();
  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async () => {
    const signoutRes = await signout();

    if (!signoutRes.success) {
      signoutRes?.errors?.forEach((error) => {
        const field = error?.field?.split(".").pop();
        toast({
          title: field ? `Error in ${field}` : "Error",
          description: error.message,
          variant: "destructive",
        });
      });

      return;
    }

    toast({
      title: "Success",
      description: "You have successfully signed out.",
    });

    router.push(clientRoutes.landing());
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Button variant="secondary" className="gap-3" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
          Sign Out
        </Button>
      </form>
    </Form>
  );
}

export default SignOutForm;
