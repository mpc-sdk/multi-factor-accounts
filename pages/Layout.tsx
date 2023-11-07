import React from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col text-base antialiased">
      <Header />
      <div className="px-4 md:px-6 xl:px-8 flex-grow pt-24 pb-12">
        {children}
      </div>
      <Footer />
    </div>
  );
}
