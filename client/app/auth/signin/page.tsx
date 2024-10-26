import React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import SignInForm from "@/components/sign-in-form";

function SignupPage() {
  return (
    <div className="w-full h-full">
      <ScrollArea className="w-full h-full">
        <div className="w-full h-full flex flex-col justify-center items-center px-8 py-12">
          <SignInForm />
        </div>
      </ScrollArea>
    </div>
  );
}

export default SignupPage;
