import Link from "next/link";
import React from "react";
import { headers } from "next/headers";

import SignOutForm from "@/components/sign-out-form";

import { clientRoutes } from "@/lib/routes";
import { getCurrentUser } from "@/lib/auth.utils";

async function Navbar() {
  const currentUser = await getCurrentUser(headers);
  return (
    <nav className="h-20 w-full px-8 flex items-center justify-between gap-4 bg-black/80 shadow-md">
      <div>
        <Link href={clientRoutes.landing()}>GitTix</Link>
      </div>

      <div className="flex items-center gap-3">
        {currentUser ? (
          <>
            <SignOutForm />
          </>
        ) : (
          <>
            <Link href={clientRoutes.signin()}>Sign In</Link>
            <Link href={clientRoutes.signup()}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
