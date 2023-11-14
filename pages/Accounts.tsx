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
import FileUpload from "@/components/FileUpload";
import ImportAccount from "@/components/ImportAccount";

import { accountsSelector, invalidateAccounts } from "@/app/store/accounts";
import { deleteAccount } from "@/lib/keyring";
import { abbreviateAddress, fromUint8Array } from "@/lib/utils";
import { Parameters } from "@/lib/types";
import { exportAccount } from "@/lib/import-export";
import guard from "@/lib/guard";

function ExportAccount({ account }: { account: KeyringAccount }) {
  const { toast } = useToast();

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
          <AlertDialogAction onClick={() => exportAccount(account.address, toast)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AccountsContent({
  children,
  onImportComplete,
}: {
  children?: React.ReactNode
  onImportComplete: () => void
}) {
  const { toast } = useToast();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Heading>Accounts</Heading>
          <ChainBadge className="mt-2" />
        </div>
        <div className="flex space-x-4">
          <ImportAccount onImportComplete={onImportComplete} />
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

function NoAccounts({onImportComplete}: {onImportComplete: () => void}) {
  return (
    <AccountsContent onImportComplete={onImportComplete}>
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

  const onChanged = async () => {
    await dispatch(invalidateAccounts());
    setRefresh(refresh + 1);
  };

  if (accounts.length == 0) {
    return <NoAccounts onImportComplete={onChanged} />;
  }

  const removeAccount = async (account: KeyringAccount) => {
    await guard(async () => {
      await deleteAccount(account.id);
      onChanged();
    }, toast);
  };

  return (
    <AccountsContent onImportComplete={onChanged}>
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
                <Link to={`/accounts/${account.address}`}>
                  <Button variant="outline">
                    <Icons.pencil className="h-4 w-4" />
                  </Button>
                </Link>
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
