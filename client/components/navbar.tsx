import Link from "next/link";
import React from "react";

import SignOutForm from "@/components/sign-out-form";
import { clientRoutes } from "@/lib/routes";

function Navbar({ currentUser }: NavbarProps) {
  return (
    <nav className="h-20 w-full px-8 flex items-center justify-between gap-4">
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
