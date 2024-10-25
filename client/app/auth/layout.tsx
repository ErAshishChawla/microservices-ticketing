import React from "react";

function AuthLayout({ children }: LayoutProps) {
  return <main className="w-full h-full">{children}</main>;
}

export default AuthLayout;
