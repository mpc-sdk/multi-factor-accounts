import React from "react";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import Icons from "@/components/Icons";
import Heading from "@/components/Heading";
//import Paragraph from "@/components/Paragraph";
//import Link from "@/components/Link";
import ChainBadge from "@/components/ChainBadge";
import KeysLoader from "@/components/KeysLoader";

import { keysSelector } from "@/app/store/keys";

function KeysContent({children}: {children: React.ReactNode}) {
  return <>
    <Heading>Keys</Heading>
    <div>
      <ChainBadge className="mt-2" />
    </div>
    {children}
  </>;
}

export default function Keys() {
  const { keyShares, loaded } = useSelector(keysSelector);

  if (!loaded) {
    return <KeysLoader />
  }


        //<Terminal className="h-4 w-4" />

  if (keyShares.length == 0) {
    return <KeysContent>
      <div className="flex flex-col justify-center items-center mt-12">

        <Alert>
          <Icons.key className="h-4 w-4" />
          <AlertTitle>No keys yet!</AlertTitle>
          <AlertDescription>
            To get started create a new key.
          </AlertDescription>
        </Alert>
        <Button className="mt-8" onClick={() => {}}>Create a new key</Button>
      </div>
    </KeysContent>;
  }

  return (
    <KeysContent />
  );
}
