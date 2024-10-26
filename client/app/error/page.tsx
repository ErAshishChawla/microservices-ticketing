import React from "react";
import Link from "next/link";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerCrashIcon, SquareArrowOutUpRight } from "lucide-react";
import { clientRoutes } from "@/lib/routes";

function ErrorPage({ searchParams }: ErrorPageProps) {
  const message =
    searchParams?.message ||
    "Uh oh! Something went wrong! Please try again later.";

  const statusCode = searchParams?.statusCode || 500;
  return (
    <div className="w-full h-full">
      <ScrollArea className="w-full h-full">
        <div className="w-full h-full flex flex-col justify-center items-center gap-8">
          <div className="flex flex-col justify-center items-center gap-4">
            <ServerCrashIcon className="w-16 h-16 text-red-500" />
            <h1 className="text-4xl font-semibold">Code: {statusCode}</h1>
          </div>
          <div className="italic text-gray-300">{message}</div>
          <Link
            href={clientRoutes.landing()}
            className="flex gap-3 items-center"
          >
            <SquareArrowOutUpRight className="w-5 h-5 text-gray-300" />
            Go to Landing Page
          </Link>
        </div>
      </ScrollArea>
    </div>
  );
}

export default ErrorPage;
