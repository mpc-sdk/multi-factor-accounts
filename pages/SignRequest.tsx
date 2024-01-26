import React, { Suspense } from "react";
import { useParams } from "react-router-dom";
import { TransactionLike } from "ethers";

import { KeyringAccount, KeyringRequest } from "@metamask/keyring-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import Loader from "@/components/Loader";
import Link from "@/components/Link";
import Heading from "@/components/Heading";
import KeyAlert from "@/components/KeyAlert";
import TransactionPreview, {
  TransactionFromPreview,
} from "@/components/TransactionPreview";
import NotFound from "@/pages/NotFound";

import { getPendingRequest } from "@/lib/keyring";
import { getChainName } from "@/lib/utils";
import { PendingRequest } from "@/lib/types";
import use from "@/lib/react-use";

function SignRequestContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Heading>Choose Key Share</Heading>
      {children}
    </>
  );
}

function ListAccountShares({
  request,
  account,
}: {
  request: KeyringRequest;
  account: KeyringAccount;
}) {
  const shares = account.options.shares as string[];
  return (
    <div className="rounded-md border">
      {shares.map((keyShareId: string, index: number) => {
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
              <Link href={`/sign/create/${request.id}/${keyShareId}`}>
                <Button>Choose</Button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SignRequestBody({
  resource,
}: {
  resource: Promise<PendingRequest | null>;
}) {
  const result = use(resource);
  const { request: pendingRequest, account } = result;

  if (!pendingRequest || !account) {
    return <NotFound />;
  }

  const method = pendingRequest.request && pendingRequest.request.method;
  if (method !== "eth_signTransaction") {
    return (
      <SignRequestContent>
        <div className="flex flex-col space-y-6 mt-12">
          <p>Signing method {method} is not supported</p>
        </div>
      </SignRequestContent>
    );
  }

  const transactionData = pendingRequest.request.params[0] || null;
  if (!transactionData) {
    return (
      <SignRequestContent>
        <div className="flex flex-col space-y-6 mt-12">
          <p>Invalid transaction data.</p>
        </div>
      </SignRequestContent>
    );
  }

  const tx = transactionData as TransactionLike;
  const chainName = getChainName(tx.chainId);
  const Badges = () => (
    <div className="flex justify-between items-center mt-2">
      {chainName && <Badge>{chainName}</Badge>}
    </div>
  );

  return (
    <SignRequestContent>
      <Badges />
      <div className="flex flex-col space-y-6 mt-12">
        <KeyAlert
          title="Sign request"
          description="Choose a key share to continue"
        />
        <TransactionFromPreview account={account} />
        <TransactionPreview tx={tx} />
        <ListAccountShares request={pendingRequest} account={account} />
      </div>
    </SignRequestContent>
  );
}

function LoadRequest({ requestId }: { requestId: string }) {
  const resource = getPendingRequest(requestId);
  return (
    <Suspense fallback={<Loader text="Loading signing request..." />}>
      <SignRequestBody resource={resource} />
    </Suspense>
  );
}

export default function SignRequest() {
  const { requestId } = useParams();
  if (!requestId) {
    return <NotFound />;
  }
  return <LoadRequest requestId={requestId} />;
}
