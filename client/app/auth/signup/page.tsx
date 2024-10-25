import React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import SignUpForm from "@/components/sign-up-form";

function SignupPage() {
  return (
    <div className="w-full h-full">
      <ScrollArea className="w-full h-full">
        <div className="w-full h-full flex flex-col justify-center items-center px-8 py-12">
          <SignUpForm />
        </div>
      </ScrollArea>
    </div>
  );
}

export default SignupPage;
