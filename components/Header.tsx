import React from "react";
import Link from "@/components/Link";
import Logo from "@/components/Logo";

export default function Header() {
  return (
    <header className="fixed z-20 w-full border-b bg-background py-4">
      <div className="flex justify-between px-4 md:px-6 xl:px-8">
        <Link href="#/" className="">
          <span className="flex items-center">
            <Logo />
            <h3 className="ml-4 font-semibold tracking-tight">
              Multi-Factor Accounts
            </h3>
          </span>
        </Link>
      </div>
    </header>
  );
}
