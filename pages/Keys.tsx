import React from "react";
import { useSelector } from "react-redux";

import Heading from "@/components/Heading";
//import Paragraph from "@/components/Paragraph";
//import Link from "@/components/Link";
import ChainBadge from "@/components/ChainBadge";
import KeysLoader from "@/components/KeysLoader";

import { keysSelector } from "@/app/store/keys";

export default function Home() {
  const { keyShares, loaded } = useSelector(keysSelector);

  if (!loaded) {
    return <KeysLoader />
  }

  return (
    <>
      <Heading>Keys</Heading>
      <div>
        <ChainBadge className="mt-2" />
      </div>
    </>
  );
}
