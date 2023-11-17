import React, { Suspense, useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { KeyringAccount } from "@metamask/keyring-api";

import Heading from "@/components/Heading";
import Icons from "@/components/Icons";
import KeyAlert from "@/components/KeyAlert";
import ChainBadge from "@/components/ChainBadge";
import Loader from "@/components/Loader";
import ImportAccount from "@/components/ImportAccount";
import AddressBadge from "@/components/AddressBadge";
import SharesBadge from "@/components/SharesBadge";

import { BroadcastContext } from "@/app/providers/broadcast";
import { listAccounts } from "@/lib/keyring";
import use from "@/lib/react-use";

function AccountsContent({
  children,
  onImportComplete,
}: {
  children?: React.ReactNode;
  onImportComplete: () => void;
}) {
  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <Heading>Accounts</Heading>
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
        <ChainBadge className="mt-2" />
      </div>
      {children}
    </>
  );
}

function NoAccounts({ onImportComplete }: { onImportComplete: () => void }) {
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

function AccountsView({ resource }: { resource: Promise<KeyringAccount[]> }) {
  const { invalidate } = useContext(BroadcastContext);
  const accounts = use(resource);
  const onChanged = () => invalidate();

  if (accounts.length === 0) {
    return <NoAccounts onImportComplete={onChanged} />;
  }

  return (
    <AccountsContent onImportComplete={onChanged}>
      <div className="mt-12 border rounded-md">
        {accounts.map((account: KeyringAccount) => {
          const { name } = account.options as {
            name: string;
          };
          return (
            <div
              key={account.id}
              className="[&:not(:last-child)]:border-b p-4 flex justify-between items-center space-x-6"
            >
              <div className="flex flex-col space-y-4">
                <div>{name}</div>
                <div className="flex flex-col space-y-2 items-start">
                  <SharesBadge account={account} />
                  <AddressBadge address={account.address} />
                </div>
              </div>

              <div className="flex justify-end">
                <Link to={`/accounts/${account.address}`}>
                  <Button variant="outline">
                    <Icons.pencil className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </AccountsContent>
  );
  return null;
}

export default function Accounts() {
  const resource = listAccounts();
  return (
    <Suspense fallback={<Loader text="Loading accounts..." />}>
      <AccountsView resource={resource} />
    </Suspense>
  );
}
