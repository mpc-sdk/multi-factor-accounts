import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { KeyringAccount } from "@metamask/keyring-api";

import Heading from "@/components/Heading";
import Link from "@/components/Link";
import ChainBadge from "@/components/ChainBadge";
import ExportAccount from "@/components/ExportAccount";
import AddressBadge from "@/components/AddressBadge";
import SharesBadge from "@/components/SharesBadge";
import Loader from "@/components/Loader";
import DeleteAccount from "@/components/DeleteAccount";

import NotFound from "@/pages/NotFound";

import { getAccountByAddress } from "@/lib/keyring";

function AccountContent({
  account,
  children,
}: {
  account: KeyringAccount;
  children?: React.ReactNode;
}) {
  const navigate = useNavigate();

  const onDeleted = async () => {
    navigate("/");
  };

  const name = (account?.options?.name as string) ?? "Untitled account";

  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <Heading>{name}</Heading>
          <div className="flex space-x-4">
            <ExportAccount account={account} buttonText="Export" />
            <DeleteAccount
              account={account}
              buttonText="Delete"
              onDeleted={onDeleted} />
          </div>
        </div>
        <ChainBadge className="mt-2" />
      </div>
      {children}
    </>
  );
}

export default function Account() {
  const navigate = useNavigate();
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
  }, [account]);

  if (!loaded) {
    return <Loader text="Loading account..." />;
  } else if (loaded && !account) {
    return <NotFound />;
  }

  const onDeleted = async (accountDeleted: boolean) => {
    setAccount(null);
    setLoaded(false);
    if (accountDeleted) {
      navigate("/");
    }
  };

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
                <div className="flex space-x-4">
                  <ExportAccount account={account} keyShareId={keyShareId} />
                  <DeleteAccount
                    account={account}
                    keyShareId={keyShareId}
                    onDeleted={onDeleted} />
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
