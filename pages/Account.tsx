import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import type { KeyringAccount } from "@metamask/keyring-api";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

import Heading from "@/components/Heading";
import Link from "@/components/Link";
import Icons from "@/components/Icons";
import ChainBadge from "@/components/ChainBadge";
import ExportAccount from "@/components/ExportAccount";
import AddressBadge from "@/components/AddressBadge";
import SharesBadge from "@/components/SharesBadge";
import Loader from "@/components/Loader";

import NotFound from "@/pages/NotFound";

import { invalidateAccounts } from "@/app/store/accounts";
import { deleteAccount, getAccountByAddress } from "@/lib/keyring";
import guard from "@/lib/guard";

function AccountContent({
  account,
  children,
}: {
  account: KeyringAccount;
  children?: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  const removeAccount = async (account: KeyringAccount) => {
    await guard(async () => {
      await deleteAccount(account.id);
      await dispatch(invalidateAccounts());
      navigate("/");
    }, toast);
  };

  const name = (account?.options?.name as string) ?? "Untitled account";

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Heading>{name}</Heading>
          <ChainBadge className="mt-2" />
        </div>
        <div className="flex space-x-4">
          <ExportAccount account={account} buttonText="Export" />
          <Button variant="destructive" onClick={() => removeAccount(account)}>
            <Icons.remove className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      {children}
    </>
  );
}

export default function Account() {
  const { address } = useParams();
  const [account, setAccount] = useState(null);
  const [loaded, setLoaded] = useState(null);

  useEffect(() => {
    const loadAccountInfo = async () => {
      const account = await getAccountByAddress(address);
      setLoaded(true);
      setAccount(account);
    };
    loadAccountInfo();
  }, []);

  if (!loaded) {
    return <Loader text="Loading account..." />;
  } else if (loaded && !account) {
    return <NotFound />;
  }

  return (
    <AccountContent account={account}>
      <div className="mt-12 flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <SharesBadge account={account} />
          <AddressBadge address={account.address} />
        </div>
        <div className="rounded-md border">
          {account.options.shares.map((keyShareId: string, index: number) => {
            return (
              <div
                key={index}
                className="[&:not(:last-child)]:border-b flex p-4 items-center justify-between"
              >
                <div className="flex space-x-4">
                  <div className="border-r pr-4">{index + 1}</div>
                  <div>Share {keyShareId}</div>
                </div>
                <div>
                  <ExportAccount account={account} keyShareId={keyShareId} />
                </div>
              </div>
            );
          })}
        </div>

        <Link href="/#/">Back to Accounts</Link>
      </div>
    </AccountContent>
  );
}
