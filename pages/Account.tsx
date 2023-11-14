import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
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

import NotFound from "@/pages/NotFound";

import { accountsSelector, invalidateAccounts } from "@/app/store/accounts";
import { deleteAccount, getAccountByAddress } from "@/lib/keyring";
import { abbreviateAddress } from "@/lib/utils";
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

function AccountContent({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Heading>Accounts</Heading>
          <ChainBadge className="mt-2" />
        </div>
        <div className="flex space-x-4">
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
    <AccountContent>
      <div className="mt-12">
        <KeyAlert
          title="No accounts yet!"
          description="To get started create a new key."
        />
      </div>
    </AccountContent>
  );
}

export default function Account() {
  const { toast } = useToast();
  const { address } = useParams();
  const dispatch = useDispatch();
  const [account, setAccount] = useState(null);
  const [loaded, setLoaded] = useState(null);

  useEffect(() => {
    const loadAccountInfo = async () => {
      const account = await getAccountByAddress(address);

      console.log("loaded account", account);

      setLoaded(true);
      setAccount(account);
    };
    loadAccountInfo();
  }, []);

  if (loaded && !account) {
    return <NotFound />;
  }

  const removeAccount = async (account: KeyringAccount) => {
    await guard(async () => {
      await deleteAccount(account.id);
      await dispatch(invalidateAccounts());
      //setRefresh(refresh + 1);
    }, toast);
  };

  return (
    <AccountContent>
      <p>{address}</p>
    </AccountContent>
  );
}
