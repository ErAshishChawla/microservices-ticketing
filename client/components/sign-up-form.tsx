"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { signupSchema, SignupValues } from "@/lib/zod.schemas";
import { signup } from "@/lib/auth.utils";
import { useToast } from "@/hooks/use-toast";
import { clientRoutes } from "@/lib/routes";

function SignUpForm() {
  const router = useRouter();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = React.useState(false);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: SignupValues) => {
    const signupRes = await signup(values);

    if (!signupRes?.success) {
      signupRes?.errors?.forEach((error) => {
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
      title: "Sign up successful",
      description: "You have successfully signed up",
      variant: "default",
    });

    form.reset();
    router.push(clientRoutes.landing());
  };

  return (
    <div className="w-full max-w-sm flex flex-col gap-8">
      <h2 className="text-4xl font-semibold">Sign up</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="flex flex-row gap-3">
                    <Input
                      placeholder="Enter your password"
                      {...field}
                      type={showPassword ? "text" : "password"}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      type="button"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? (
                        <Eye className="w-8 h-8" />
                      ) : (
                        <EyeOff className="w-8 h-8" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant={"secondary"}
            disabled={isSubmitting}
            className="gap-3 w-full sm:w-fit"
          >
            {isSubmitting && <Loader2 className="w-6 h-6 animate-spin" />}
            Sign up
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default SignUpForm;
