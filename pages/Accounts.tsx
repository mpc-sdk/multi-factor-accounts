import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

import Heading from "@/components/Heading";
import KeyAlert from "@/components/KeyAlert";
import ChainBadge from "@/components/ChainBadge";
import AccountsLoader from "@/components/AccountsLoader";

import { accountsSelector } from "@/app/store/accounts";

//import {createAccount} from '@/lib/keyring';

function KeysContent({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Heading>Keys</Heading>
      <ChainBadge className="mt-2" />
      {children}
    </>
  );
}

function NoAccounts() {
  /*
  const testCreateAccount = async () => {
    const address = "0xff520E5600107b16B3c1C01E0B01941C7217e7ff";
    const privateKey = JSON.stringify({"foo": "bar"});

    await createAccount(address, privateKey);
  };

          <Button className="mt-8"
            onClick={testCreateAccount}>Create a TESTkey</Button>
  */

  return (
    <KeysContent>
      <div className="mt-12">
        <KeyAlert
          title="No accounts yet!"
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

export default function Accounts() {
  const { accounts, loaded } = useSelector(accountsSelector);

  if (!loaded) {
    return <AccountsLoader />;
  }

  console.log("Got accounts length", accounts.length);

  if (accounts.length == 0) {
    return <NoAccounts />;
  }

  return <KeysContent />;
}
