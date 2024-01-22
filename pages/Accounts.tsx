import React, { Suspense, useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { KeyringAccount, KeyringRequest } from "@metamask/keyring-api";
import { formatEther, Transaction } from 'ethers';

import { useToast } from "@/components/ui/use-toast";
import Heading, { SubHeading } from "@/components/Heading";
import Icons from "@/components/Icons";
import KeyAlert from "@/components/KeyAlert";
import ChainBadge from "@/components/ChainBadge";
import Loader from "@/components/Loader";
import ImportAccount from "@/components/ImportAccount";
import AddressBadge from "@/components/AddressBadge";
import SharesBadge from "@/components/SharesBadge";

import { BroadcastContext } from "@/app/providers/broadcast";
import { listAccounts, listRequests, rejectRequest } from "@/lib/keyring";
import guard from '@/lib/guard';
import use from "@/lib/react-use";

function RequestsView({ resource }: { resource: Promise<KeyringRequest[]> }) {
  const { invalidate } = useContext(BroadcastContext);
  const requests = use(resource);
  const { toasts } = useToast();

  const rejectPendingRequest = async (id: string) => {
    await guard(async () => {
      await rejectRequest(id);
      invalidate();
    }, toasts);
  };

  if (requests.length === 0) {
    return null;
  }

  return <div className="mt-12">
    <SubHeading>Requests</SubHeading>
    <div className="mt-4 border rounded-md">
      {requests.map((pendingRequest) => {
        const tx = pendingRequest.request.params[0] as Transaction;

        return <div
          key={pendingRequest.id}
          className="flex justify-between p-4 items-center">
            <div className="flex flex-col">
              <div>Send {formatEther(tx.value)} ETH to</div>
              <div>{tx.to}</div>
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                variant="destructive"
                onClick={() => rejectPendingRequest(pendingRequest.id)}>Reject</Button>
              <Link to={`/sign/${pendingRequest.id}`}>
                <Button>Sign</Button>
              </Link>
            </div>
        </div>;
      })}
    </div>
  </div>;
}

function PendingRequests() {
  const resource = listRequests();
  return (
    <Suspense fallback={<Loader text="Loading pending requests..." />}>
      <RequestsView resource={resource} />
    </Suspense>
  );
}

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
      <PendingRequests />
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
