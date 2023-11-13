import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

import Heading from "@/components/Heading";
import KeyAlert from "@/components/KeyAlert";
import ChainBadge from "@/components/ChainBadge";
import AccountsLoader from "@/components/AccountsLoader";

import { accountsSelector } from "@/app/store/accounts";

import { createAccount, getWalletByAddress } from '@/lib/keyring';

function AccountsContent({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Heading>Accounts</Heading>
      <ChainBadge className="mt-2" />
      {children}
    </>
  );
}

function NoAccounts() {
  const testCreateAccount = async () => {
    const address = "0xff520E5600107b16B3c1C01E0B01941C7217e7ff";
    const privateKey = JSON.stringify({"foo": "bar"});

    await createAccount(address, privateKey);
  };

  return (
    <AccountsContent>
      <div className="mt-12">
        <KeyAlert
          title="No accounts yet!"
          description="To get started create a new key."
        />
        <div className="flex justify-end">
          <Button className="mt-8"
            onClick={testCreateAccount}>Create a TESTkey</Button>

          <Link to="/keys/create">
            <Button className="mt-8">Create a new key</Button>
          </Link>
        </div>
      </div>
    </AccountsContent>
  );
}

export default function Accounts() {
  const { accounts, loaded } = useSelector(accountsSelector);

  if (!loaded) {
    return <AccountsLoader />;
  }

  if (accounts.length == 0) {
    return <NoAccounts />;
  }

  const testGetWalletByAddress = async (address: string) => {
    const wallet = await getWalletByAddress(address);
    console.log("Got wallet", wallet);
  };

  return <AccountsContent>
    {accounts.map((account) => {
      console.log(account);
      return <div key={account.id} className="flex">
        {account.address}
        <Button className="mt-8"
          onClick={() => testGetWalletByAddress(account.address)}>Get wallet</Button>
      </div>;
    })}
  </AccountsContent>;
}
