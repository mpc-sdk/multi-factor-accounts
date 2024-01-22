import React, { Suspense, useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { KeyringAccount } from "@metamask/keyring-api";

import { formatEther } from 'ethers';

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import Heading from "@/components/Heading";
import Icons from "@/components/Icons";
import Link from "@/components/Link";
import ChainBadge from "@/components/ChainBadge";
import ExportAccount from "@/components/ExportAccount";
import AddressBadge from "@/components/AddressBadge";
import SharesBadge from "@/components/SharesBadge";
import Loader from "@/components/Loader";
import DeleteAccount from "@/components/DeleteAccount";
import EditAccount from "@/components/EditAccount";

import NotFound from "@/pages/NotFound";

import { useBalance } from '@/app/hooks';
import { getAccountByAddress, updateAccount } from "@/lib/keyring";
import use from "@/lib/react-use";
import guard from "@/lib/guard";

function AccountContent({
  account,
  children,
  onChanged,
}: {
  account: KeyringAccount;
  children?: React.ReactNode;
  onChanged: () => void;
}) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const onDeleted = async () => {
    navigate("/");
  };

  const accountName = (account?.options?.name as string) ?? "Untitled account";

  const onUpdateName = async (value: string) => {
    account.options.name = value;
    await guard(async () => {
      await updateAccount(account);
      onChanged();
    }, toast);
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-between space-x-6">
          <Heading>
            {accountName}
          </Heading>
          <div className="flex space-x-4">

            <EditAccount
              initialValue={accountName}
              onUpdate={onUpdateName}
            />

            <ExportAccount
              account={account}
              buttonText="Export"
              accountName={accountName}
            />
            <DeleteAccount
              account={account}
              buttonText="Delete"
              onDeleted={onDeleted}
            />
          </div>
        </div>
        <ChainBadge className="mt-2" />
      </div>
      {children}
    </>
  );
}

function AccountView({
  resource,
  onChanged,
}: {
  resource: Promise<KeyringAccount>;
  onChanged: () => void;
}) {
  const navigate = useNavigate();
  const account = use(resource);
  const balance = useBalance(account.address);

  if (balance === null) return;

  if (!account) {
    return <NotFound />;
  }

  const onDeleted = async (accountDeleted: boolean) => {
    onChanged();
    if (accountDeleted) {
      navigate("/");
    }
  };

  const accountName = (account?.options?.name as string) ?? "Untitled account";

  return (
    <AccountContent account={account} onChanged={onChanged}>
      <div className="mt-12 flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <SharesBadge account={account} />
          <AddressBadge address={account.address} />
        </div>
        <div className="border rounded-md p-4">
          {formatEther(balance)} ETH
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
                  <ExportAccount
                    account={account}
                    keyShareId={keyShareId}
                    accountName={accountName}
                  />
                  <DeleteAccount
                    account={account}
                    keyShareId={keyShareId}
                    onDeleted={onDeleted}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <Link href="/">
          <Button variant="link">
            <Icons.back className="h-4 w-4 mr-2" />
            Back to accounts
          </Button>
        </Link>
      </div>
    </AccountContent>
  );
}

export default function Account() {
  const [changed, setChanged] = useState(0);
  const onChanged = () => setChanged(changed + 1);
  const { address } = useParams();
  const resource = getAccountByAddress(address);
  return (
    <Suspense fallback={<Loader text="Loading account..." />}>
      <AccountView resource={resource} onChanged={onChanged} />
    </Suspense>
  );
}
