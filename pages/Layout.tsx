import React from "react";

import { Toaster } from "@/components/ui/toaster";

import Header from "@/components/Header";
import Footer from "@/components/Footer";


        //<div className="max-w-xlg px-4 md:px-6 xl:px-8 pt-24 pb-12">

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col text-base antialiased">
      <Header />
      <div className="flex flex-col items-center flex-grow">

        <div className="container relative mx-auto flex justify-center pt-24 pb-12 px-4 md:px-6 xl:px-8">

          <div className="max-w-prose grow">
            {children}
          </div>
        </div>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}
