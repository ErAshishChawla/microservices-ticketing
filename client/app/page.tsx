import React from "react";
import { headers } from "next/headers";

import { getCurrentUser } from "@/lib/auth.utils";
import { ScrollArea } from "@/components/ui/scroll-area";

async function Page() {
  const currentUser = await getCurrentUser(headers);
  return (
    <div className="w-full h-full">
      <ScrollArea className="w-full h-full">
        <div className="w-full h-full flex flex-col items-center justify-center">
          {currentUser ? (
            <h1 className="text-5xl">You are signed in</h1>
          ) : (
            <h1 className="text-5xl">You are not signed in</h1>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default Page;
