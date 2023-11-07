import React from "react";
import Heading from "@/components/Heading";
//import Paragraph from "@/components/Paragraph";
//import Link from "@/components/Link";
import ChainBadge from "@/components/ChainBadge";

export default function Home() {
  return (
    <>
      <Heading>Keys</Heading>
      <div>
        <ChainBadge className="mt-2" />
      </div>
    </>
  );
}
