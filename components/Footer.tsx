import React from "react";
import FooterLinks from "@/components/FooterLinks";
import Logo from "@/components/Logo";
import Link from "@/components/Link";

export default function Footer() {
  return (
    <footer className="border-t border-t-primary-20 ">
      <div className="container mx-auto px-4 py-12 xl:max-w-5xl">
        <div className="grid grid-cols-2 gap-y-8  md:grid-cols-3 md:gap-x-8 md:gap-y-8 xl:ml-auto xl:w-2/3 xl:pl-2">
          <FooterLinks
            title="Info"
            links={[{ name: "About", href: "/#about" }]}
          />
        </div>
        <div className="flex flex-col items-center space-y-4 pt-12 text-center md:flex-row md:justify-between md:space-y-0">
          <Logo />
          <p className="text-primary-30">
            © 2023 <Link href="https://metamask.io">MetaMask</Link>. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
