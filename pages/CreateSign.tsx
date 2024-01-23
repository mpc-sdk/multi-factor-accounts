import React, { Suspense, useEffect, useState, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatEther, TransactionLike } from 'ethers';

import { KeyringAccount, KeyringRequest } from "@metamask/keyring-api";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import Loader from "@/components/Loader";
import Link from "@/components/Link";
import MeetingPoint from "@/components/MeetingPoint";
import Heading from "@/components/Heading";
import KeyAlert from "@/components/KeyAlert";
import TransactionPreview, { TransactionFromPreview } from "@/components/TransactionPreview";
import NotFound from "@/pages/NotFound";

import guard from "@/lib/guard";
import { getAccountByAddress, getPendingRequest, rejectRequest } from "@/lib/keyring";
import { getChainName } from "@/lib/utils";
import { PendingRequest} from "@/lib/types";
import use from "@/lib/react-use";

import {
  PublicKeys,
  CreateSignState,
  KeyShareAudience,
  OwnerType,
  SessionType,
  SessionState,
} from "@/app/model";

function CreateSignContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Heading>Sign Transaction</Heading>
      {children}
    </>
  );
}

function CreateSignBody({ resource, shareId }: { resource: Promise<PendingRequest | null>, shareId: string }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const result = use(resource);
  const { request: pendingRequest, account } = result;

  console.log(account);

//http://localhost:7070/keys/join/278e05e2-0492-48c2-b459-a8c90dd6d6de/2d37d7c901d280a3d361da62f1bc10b9c428db9043e46564ee9cb4820b1bd144?name=Test+Key

  const [createSignState, setCreateSignState] = useState<CreateSignState>({
    ownerType: OwnerType.initiator,
    sessionType: SessionType.sign,
    name: account?.options?.name ?? "Untitled account",
    audience: KeyShareAudience.self,
    parties: account.options.parameters.parties,
    threshold: account.options.parameters.threshold,
  });
  const [publicKeys, setPublicKeys] = useState<PublicKeys>(null);

  if (!pendingRequest || !account) {
    return <NotFound />;
  }

  const method = pendingRequest.request && pendingRequest.request.method;
  if (method !== "eth_signTransaction") {
    return <CreateSignContent>
      <div className="flex flex-col space-y-6 mt-12">
        <p>Signing method {method} is not supported</p>
      </div>
    </CreateSignContent>
  }

  const transactionData = pendingRequest.request.params[0] || null;
  if (!transactionData) {
    return <CreateSignContent>
      <div className="flex flex-col space-y-6 mt-12">
        <p>Invalid transaction data.</p>
      </div>
    </CreateSignContent>
  }

  const tx = transactionData as TransactionLike;

  const chainName = getChainName(tx.chainId);
  const Badges = () => (
    <div className="flex justify-between items-center mt-2">
      {chainName && <Badge>{chainName}</Badge>}
    </div>
  );

  /*
        <TransactionFromPreview tx={tx} account={account} />
        <TransactionPreview tx={tx} />
  */

  if (publicKeys) {
    return <p>Start signing session</p>;
  }

  return (
    <CreateSignContent>
      <Badges />
      <div className="flex flex-col space-y-6 mt-12">
        <KeyAlert
          title="Invitations"
          description="Share links to invite participants to sign this transaction, each link may only be used once. Send the links using your favorite messaging or email app, when everyone joins we can continue."
        />
        <MeetingPoint
          linkPrefix="sign"
          session={createSignState as SessionState}
          onMeetingPointReady={(keys) => setPublicKeys(keys)}
        />
      </div>
    </CreateSignContent>
  );
}

function LoadRequest({ requestId, shareId }: { requestId: string, shareId: string }) {
  const resource = getPendingRequest(requestId);
  return (
    <Suspense fallback={<Loader text="Loading signing request..." />}>
      <CreateSignBody resource={resource} shareId={shareId} />
    </Suspense>
  );
}

export default function CreateSign() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { requestId, shareId } = useParams();
  if (!requestId || !shareId) {
    return <NotFound />;
  }
  return <LoadRequest requestId={requestId} shareId={shareId} />;
}
