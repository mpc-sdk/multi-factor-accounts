import React, { Suspense, useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatEther, TransactionLike } from "ethers";
import { KeyringAccount, KeyringRequest } from "@metamask/keyring-api";

import { KeypairContext } from "@/app/providers/keypair";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import Loader from "@/components/Loader";
import Link from "@/components/Link";
import CreateSignAlert from "@/components/CreateSignAlert";
import MeetingPoint from "@/components/MeetingPoint";
import Heading from "@/components/Heading";
import SessionRunner from "@/components/SessionRunner";
import KeyAlert from "@/components/KeyAlert";
import TransactionPreview, {
  TransactionFromPreview,
} from "@/components/TransactionPreview";
import NotFound from "@/pages/NotFound";
import guard from "@/lib/guard";
import {
  getAccountByAddress,
  getPendingRequest,
  rejectRequest,
  getWalletByAddress,
  approveRequest,
} from "@/lib/keyring";
import {
  getChainName,
  encodeTransactionToHash,
  encodeSignedTransaction,
} from "@/lib/utils";
import { PendingRequest } from "@/lib/types";
import { sign, WebassemblyWorker } from "@/lib/client";
import use from "@/lib/react-use";

import {
  PublicKeys,
  CreateSignState,
  KeyShareAudience,
  OwnerType,
  SessionType,
  SessionState,
  Signature,
} from "@/app/model";

function CreateSignContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Heading>Sign Transaction</Heading>
      {children}
    </>
  );
}

function CompleteTransaction({
  requestId,
  account,
  tx,
  transaction,
  signature,
  badges,
}: {
  requestId: string;
  account: KeyringAccount;
  tx: TransactionLike;
  transaction: string;
  signature: Signature;
  badges: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const signedTransaction = encodeSignedTransaction(tx, signature);
  //console.log("raw transaction", signedTransaction.serialized);

  const submitTransaction = async () => {
    await guard(async () => {
      const txHash = (await window.ethereum.request({
        method: "eth_sendRawTransaction",
        params: [signedTransaction.serialized],
      })) as string;

      console.log("submitted transaction hash", txHash);

      if (txHash) {
        // Approve the request to remove from the pending requests
        await approveRequest(requestId);
        // Confirm
        toast({
          title: "Transaction confirmed",
          description: `Tx Hash: ${txHash}`,
        });

        navigate(`/accounts/${account.address}`);
      }
    }, toast);
  };

  return (
    <CreateSignContent>
      {badges}
      <div className="flex flex-col space-y-6 mt-12">
        <KeyAlert
          title="Transaction Signed"
          description="To complete the transaction submit it to the blockchain."
        />
        <TransactionFromPreview tx={tx} account={account} />
        <TransactionPreview tx={tx} />
        <div className="flex justify-end">
          <Button onClick={submitTransaction}>Submit Transaction</Button>
        </div>
      </div>
    </CreateSignContent>
  );
}

function CreateSignBody({
  resource,
  requestId,
  shareId,
}: {
  resource: Promise<PendingRequest | null>;
  requestId: string;
  shareId: string;
}) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const keypair = useContext(KeypairContext);
  const [signature, setSignature] = useState(null);
  const result = use(resource);

  const { request: pendingRequest, account } = result;
  const method = pendingRequest.request && pendingRequest.request.method;
  const transactionData = pendingRequest.request.params[0] || null;
  const tx = transactionData as TransactionLike;
  const transaction = encodeTransactionToHash(tx);

  const [createSignState, setCreateSignState] = useState<CreateSignState>({
    ownerType: OwnerType.initiator,
    sessionType: SessionType.sign,
    name: account?.options?.name ?? "Untitled account",
    audience: KeyShareAudience.self,
    parties: account.options.parameters.parties,
    threshold: account.options.parameters.threshold,
  });
  const [publicKeys, setPublicKeys] = useState<PublicKeys>(null);

  if (keypair === null) {
    return null;
  }
  const { publicKey } = keypair;

  if (!pendingRequest || !account) {
    return <NotFound />;
  }

  const chainName = getChainName(tx.chainId);
  const Badges = () => (
    <div className="flex justify-between items-center mt-2">
      {chainName && <Badge>{chainName}</Badge>}
    </div>
  );

  if (signature !== null) {
    return (
      <CompleteTransaction
        requestId={requestId}
        account={account}
        tx={tx}
        transaction={transaction}
        signature={signature}
        badges={<Badges />}
      />
    );
  }

  if (method !== "eth_signTransaction") {
    return (
      <CreateSignContent>
        <div className="flex flex-col space-y-6 mt-12">
          <p>Signing method {method} is not supported</p>
        </div>
      </CreateSignContent>
    );
  }

  if (!transactionData) {
    return (
      <CreateSignContent>
        <div className="flex flex-col space-y-6 mt-12">
          <p>Invalid transaction data.</p>
        </div>
      </CreateSignContent>
    );
  }

  /*
        <TransactionFromPreview tx={tx} account={account} />
        <TransactionPreview tx={tx} />
  */

  const startSigning = async (worker: WebassemblyWorker, serverUrl: string) => {
    console.log("Start sign transaction (initiator)", transaction);
    await guard(async () => {
      // Public keys includes all members of the meeting but when
      // we initiate key generation the participants list should not
      // include the public key of the initiator
      const participants = publicKeys.filter((key) => key !== publicKey);

      // Find the key share to use
      const wallet = await getWalletByAddress(account.address);
      if (!wallet) {
        throw new Error(`wallet not found for ${account.address}`);
      }
      const signingKey = wallet.privateKey[shareId];
      if (!signingKey) {
        throw new Error(
          `signing key not found for ${account.address} with key share id ${shareId}`,
        );
      }

      const signature = await sign(
        worker,
        serverUrl,
        participants,
        signingKey,
        transaction,
      );

      console.log("signature", signature);
      setSignature(signature);
    }, toast);
  };

  if (publicKeys !== null) {
    return (
      <CreateSignContent>
        <Badges />
        <SessionRunner
          loaderText="Signing transaction..."
          message={<CreateSignAlert />}
          executor={startSigning}
        />
      </CreateSignContent>
    );
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
          extraParams={{ tx, initiatorKeyShareId: shareId, transaction }}
        />
      </div>
    </CreateSignContent>
  );
}

function LoadRequest({
  requestId,
  shareId,
}: {
  requestId: string;
  shareId: string;
}) {
  const resource = getPendingRequest(requestId);
  return (
    <Suspense fallback={<Loader text="Loading signing request..." />}>
      <CreateSignBody
        resource={resource}
        requestId={requestId}
        shareId={shareId}
      />
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
