import React from "react";
import axios from "axios";

import { clientRoutes, internalApiRoutes } from "@/lib/routes";
import { sendInternalApiRequest } from "@/lib/fetch.utils";
import { HttpMethods } from "@/lib/types.utils";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

async function Page() {
  const headersList = headers();
  const newHeaders: KeyValueObject = {};
  headersList.forEach((value, key) => {
    newHeaders[key] = value;
  });
  const config = {
    method: HttpMethods.GET,
    url: "http://auth-srv:3000/api/users/currentuser",
    headers: {
      ...newHeaders,
      "Content-Type": "application/json",
      Host: "ticketing.dev",
      "Custom-Header": "custom",
    },
  };
  try {
    const res = await axios(config);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
  return (
    <div className="w-full h-full">
      {/* {currentUser ? "You are logged in" : "You are not logged in"} */}
      Hi
    </div>
  );
}

export default Page;
