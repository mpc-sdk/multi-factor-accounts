import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

import Heading from "@/components/Heading";
import KeyAlert from "@/components/KeyAlert";
import ChainBadge from "@/components/ChainBadge";
import KeysLoader from "@/components/KeysLoader";

import { keysSelector } from "@/app/store/keys";

function KeysContent({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Heading>Keys</Heading>
      <ChainBadge className="mt-2" />
      {children}
    </>
  );
}

function NoKeys() {
  return (
    <KeysContent>
      <div className="mt-12">
        <KeyAlert
          title="No keys yet!"
          description="To get started create a new key."
        />
        <div className="flex justify-end">
          <Link to="/keys/create">
            <Button className="mt-8">Create a new key</Button>
          </Link>
        </div>
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
