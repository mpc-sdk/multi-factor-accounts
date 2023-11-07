import React from "react";

import { Toaster } from "@/components/ui/toaster";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col text-base antialiased">
      <Header />
      <div className="flex flex-col items-center flex-grow">
        <div className="max-w-xlg px-4 md:px-6 xl:px-8 pt-24 pb-12">
          {children}
        </div>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}
