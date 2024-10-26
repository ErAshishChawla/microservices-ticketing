import React from "react";
import axios from "axios";

import { HttpMethods } from "@/lib/types.utils";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { buildClientServer } from "@/lib/axios.utils";

async function Page() {
  const handler = buildClientServer(headers);

  const config = {
    method: HttpMethods.GET,
    url: "/api/users/currentuser",
  };

  const getCurrentUserRes = await handler(config);

  const currentUser = getCurrentUserRes?.data;

  return (
    <div className="w-full h-full">
      {currentUser ? "You are logged in" : "You are not logged in"}
    </div>
  );
}

export default Page;
