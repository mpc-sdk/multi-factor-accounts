import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { KeyringAccount } from "@metamask/keyring-api";

import { Button } from "@/components/ui/button";

import Heading from "@/components/Heading";
import Icons from "@/components/Icons";
import KeyAlert from "@/components/KeyAlert";
import ChainBadge from "@/components/ChainBadge";
import AccountsLoader from "@/components/AccountsLoader";

import { accountsSelector } from "@/app/store/accounts";
import { createAccount, getWalletByAddress } from '@/lib/keyring';
import { abbreviateAddress } from '@/lib/utils';

function AccountsContent({ children }: { children?: React.ReactNode }) {

  const importAccount = async () => {
    console.log("Import account...");
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Heading>Accounts</Heading>
          <ChainBadge className="mt-2" />
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={importAccount}>
            <Icons.upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Link to="/keys/create">
            <Button>
              <Icons.plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </Link>
        </div>
      </div>
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

  /*
  const testGetWalletByAddress = async (address: string) => {
    const wallet = await getWalletByAddress(address);
    console.log("Got wallet", wallet);
  };


          <Button className=""
            onClick={() => testGetWalletByAddress(account.address)}>W</Button>
  */

  const deleteAccount = async (account: KeyringAccount) => {
    console.log("deleting...");
    console.log(account);
  };

  const exportAccount = async (account: KeyringAccount) => {
    console.log("exporting...");
    console.log(account.address);

    const wallet = await getWalletByAddress(account.address);

    console.log("export", wallet);
  };

  return <AccountsContent>
    <div className="mt-12 border rounded-md">
      {accounts.map((account) => {
        return <div
          key={account.id}
          className="[&:not(:last-child)]:border-b flex p-4 items-center justify-between">
          {abbreviateAddress(account.address)}
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => exportAccount(account)}>
              <Icons.download className="h-4 w-4" />
            </Button>
            <Button variant="destructive" onClick={() => deleteAccount(account)}>
              <Icons.remove className="h-4 w-4" />
            </Button>
          </div>
        </div>;
      })}
    </div>
  </AccountsContent>;
}
