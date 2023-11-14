import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { KeyringAccount } from "@metamask/keyring-api";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import Heading from "@/components/Heading";
import Icons from "@/components/Icons";
import KeyAlert from "@/components/KeyAlert";
import ChainBadge from "@/components/ChainBadge";
import AccountsLoader from "@/components/AccountsLoader";

import { accountsSelector, invalidateAccounts } from "@/app/store/accounts";
import { deleteAccount, getWalletByAddress } from "@/lib/keyring";
import { abbreviateAddress, toUint8Array, download } from "@/lib/utils";
import { Parameters } from "@/lib/types";
import { ExportedAccount } from "@/app/model";
import guard from "@/lib/guard";

function ExportAccount({ account }: { account: KeyringAccount }) {
  const { toast } = useToast();
  const exportAccount = async (account: KeyringAccount) => {
    await guard(async () => {
      const { address } = account;
      const wallet = await getWalletByAddress(account.address);
      const exported: ExportedAccount = {
        address,
        privateKey: wallet.privateKey,
      };
      const fileName = `${address}.json`;
      const value = JSON.stringify(exported, undefined, 2);
      download(fileName, toUint8Array(value));
    }, toast);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Icons.download className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Export account</AlertDialogTitle>
          <AlertDialogDescription>
            Exporting this account will download the private key to your
            computer unencrypted; you should copy the file to safe encrypted
            storage such as a password manager and delete the downloaded file
            from your disc.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => exportAccount(account)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AccountsContent({ children }: { children?: React.ReactNode }) {
  const { toast } = useToast();

  const importAccount = async () => {
    console.log("Import account...");

    /*
    const data = {};
    await guard(async () => {
      try {
        gg20.parse(data);
      } catch(error) {
        const validationError = fromZodError(error);
        throw validationError;
      }
    }, toast);
    */
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
  return (
    <AccountsContent>
      <div className="mt-12">
        <KeyAlert
          title="No accounts yet!"
          description="To get started create a new key."
        />
      </div>
    </AccountsContent>
  );
}

export default function Accounts() {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(0);
  const { accounts, loaded } = useSelector(accountsSelector);

  if (!loaded) {
    return <AccountsLoader />;
  }

  if (accounts.length == 0) {
    return <NoAccounts />;
  }

  const removeAccount = async (account: KeyringAccount) => {
    await guard(async () => {
      await deleteAccount(account.id);
      await dispatch(invalidateAccounts());
      setRefresh(refresh + 1);
    }, toast);
  };

  return (
    <AccountsContent>
      <div className="mt-12 border rounded-md">
        {accounts.map((account) => {
          const { name, numShares, parameters } = account.options as {
            name: string;
            numShares: number;
            parameters: Parameters;
          };
          return (
            <div
              key={account.id}
              className="[&:not(:last-child)]:border-b flex p-4 items-center justify-between"
            >
              <div>
                <div>{name}</div>
                <div className="text-sm">
                  {abbreviateAddress(account.address)}
                </div>
                <Badge variant="outline" className="mt-4">
                  {numShares} share{numShares > 1 ? 's' : ''} in a {parameters.threshold + 1} of{" "}
                  {parameters.parties}
                </Badge>
              </div>
              <div className="flex space-x-4">
                <ExportAccount account={account} />
                <Button
                  variant="destructive"
                  onClick={() => removeAccount(account)}
                >
                  <Icons.remove className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </AccountsContent>
  );
}
