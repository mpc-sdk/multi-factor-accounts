import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import Icons from "@/components/Icons";
import Heading from "@/components/Heading";
import ChainBadge from "@/components/ChainBadge";
import KeysLoader from "@/components/KeysLoader";

import { keysSelector } from "@/app/store/keys";

function KeysContent({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Heading>Keys</Heading>
      <div>
        <ChainBadge className="mt-2" />
      </div>
      {children}
    </>
  );
}

function NoKeys() {
  return (
    <KeysContent>
      <div className="mt-12">
        <Alert>
          <Icons.key className="h-4 w-4" />
          <AlertTitle>No keys yet!</AlertTitle>
          <AlertDescription>To get started create a new key.</AlertDescription>
        </Alert>
        <Link to="/keys/create">
          <Button className="mt-8">Create a new key</Button>
        </Link>
      </div>
    </KeysContent>
  );
}

export default function Keys() {
  const { keyShares, loaded } = useSelector(keysSelector);

  if (!loaded) {
    return <KeysLoader />;
  }

  if (keyShares.length == 0) {
    return <NoKeys />;
  }

  return <KeysContent />;
}
