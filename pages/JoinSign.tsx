import React, { Suspense, useState, useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { TransactionLike } from "ethers";
import { KeyringAccount } from "@metamask/keyring-api";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

import { KeypairContext } from "@/app/providers/keypair";
import Heading from "@/components/Heading";
import Loader from "@/components/Loader";
import KeyAlert from "@/components/KeyAlert";
import CreateSignAlert from "@/components/CreateSignAlert";
import TransactionPreview, {
  TransactionFromPreview,
} from "@/components/TransactionPreview";
import KeyBadge from "@/components/KeyBadge";
import PublicKeyBadge from "@/components/PublicKeyBadge";
import MeetingPoint from "@/components/MeetingPoint";
import SessionRunner from "@/components/SessionRunner";

import {
  PublicKeys,
  AssociatedData,
  SessionState,
  OwnerType,
  SessionType,
} from "@/app/model";

import NotFound from "@/pages/NotFound";

import guard from "@/lib/guard";
import use from "@/lib/react-use";
import {
  getAccountByAddress,
  getWalletByAddress,
} from "@/lib/keyring";
import { sign, WebassemblyWorker } from "@/lib/client";
import { PrivateKey } from "@/lib/types";
import { encodeTransactionToHash } from "@/lib/utils";

function JoinSignContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Heading>Join Transaction</Heading>
      {children}
    </>
  );
}

function ReviewTransaction({
  account,
  tx,
  badges,
  onApproved,
}: {
  account: KeyringAccount;
  tx: TransactionLike;
  badges: React.ReactNode;
  onApproved: () => void;
}) {
  return (
    <JoinSignContent>
      {badges}
      <div className="flex flex-col space-y-6 mt-12">
        <KeyAlert
          title="Join transaction"
          description="Review the transaction and approve to begin signing"
        />
        <TransactionFromPreview account={account} tx={tx} />
        <TransactionPreview tx={tx} />
        <div className="flex justify-end">
          <Button onClick={onApproved}>Approve Transaction</Button>
        </div>
      </div>
    </JoinSignContent>
  );
}

function JoinSignWithAccount({
  tx,
  resource,
  publicKeys,
  badges,
  initiatorKeyShareId,
}: {
  tx: TransactionLike;
  resource: Promise<KeyringAccount | null>;
  publicKeys: PublicKeys;
  badges: React.ReactNode;
  initiatorKeyShareId: string;
}) {
  const { toast } = useToast();
  const [approved, setApproved] = useState(false);
  const account = use(resource);
  if (!account) {
    return <NotFound />;
  }
  const shares = account.options.shares as string[];
  const remainingShares = shares.filter((shareId: string) => shareId !== initiatorKeyShareId);

  // TODO: when remainingShares.length > 1 let the use pick
  // TODO: which share to use after clicking "Approve Transaction"

  //console.log("shares", shares);
  //console.log("remainingShares", remainingShares);
  const shareId = remainingShares[0];

  const startSigning = async (worker: WebassemblyWorker, serverUrl: string) => {
    console.log("Start signing (participant)..");

    await guard(async () => {

      // Find the key share to use
      const wallet = await getWalletByAddress(account.address);
      if (!wallet) {
        throw new Error(`wallet not found for ${account.address}`);
      }
      const signingKey = wallet.privateKey[shareId];
      if (!signingKey) {
        throw new Error(
          `signing key not found for ${account.address} with key share id ${shareId}`);
      }

      const signature = await sign(
        worker,
        serverUrl,
        null, // Participants MUST be null when joining
        signingKey,
        transaction,
      );

      console.log("signature", signature);
    }, toast);
  };

  if (approved) {
    return (
      <JoinSignContent>
        {badges}
        <SessionRunner
          loaderText="Signing transaction..."
          message={<CreateSignAlert />}
          executor={startSigning}
        />
      </JoinSignContent>
    );
  }

  return (
    <ReviewTransaction
      account={account}
      tx={tx}
      badges={badges}
      onApproved={() => setApproved(true)}
    />
  );
}

function JoinSignLoadAccount({
  tx,
  publicKeys,
  badges,
  initiatorKeyShareId,
}: {
  tx: TransactionLike;
  publicKeys: PublicKeys;
  badges: React.ReactNode;
  initiatorKeyShareId: string;
}) {
  const resource = getAccountByAddress(tx.from);
  return (
    <Suspense fallback={<Loader text="Loading account..." />}>
      <JoinSignWithAccount
        tx={tx}
        resource={resource}
        publicKeys={publicKeys}
        badges={badges}
        initiatorKeyShareId={initiatorKeyShareId}
      />
    </Suspense>
  );
}

export default function JoinSign() {
  const keypair = useContext(KeypairContext);

  const { toast } = useToast();
  const [publicKeys, setPublicKeys] = useState<PublicKeys>(null);
  const [signData, setSignData] = useState<AssociatedData>(null);
  const { meetingId, userId } = useParams();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");
  // Transaction data to show to the user
  const tx =
    signData && (Object.fromEntries(signData.get("tx")) as TransactionLike);
  // Digest to sign computed by the initiator
  const transaction =
    signData && (signData.get("transaction") as string);
  const initiatorKeyShareId =
    signData && (signData.get("initiatorKeyShareId") as string);

  if (keypair === null) {
    return null;
  }
  const { publicKey } = keypair;

  if (!meetingId || !userId || !name) {
    return <NotFound />;
  }

  // Check the transaction data matches the transaction hash that
  // the initiator sent.
  const encodedTransaction = encodeTransactionToHash(tx);

  console.log("transaction", transaction);
  console.log("encoded", encodedTransaction);

  if (transaction && tx && encodedTransaction !== transaction) {
    throw new Error(
      "transaction mismatch, hash does not match transaction data");
  }

  const session: SessionState = {
    ownerType: OwnerType.participant,
    sessionType: SessionType.sign,
    meetingId,
    userId,
  };

  const Badges = () => (
    <div className="flex justify-between items-center mt-2">
      <KeyBadge
        name={name}
        parties={signData && (signData.get("parties") as number)}
        threshold={signData && (signData.get("threshold") as number)}
      />
      <PublicKeyBadge publicKey={publicKey} />
    </div>
  );

  if (tx) {
    return (
      <JoinSignLoadAccount
        tx={tx}
        publicKeys={publicKeys}
        badges={<Badges />}
        initiatorKeyShareId={initiatorKeyShareId}
      />
    );
  }

  return (
    <JoinSignContent>
      <Badges />
      <div className="flex flex-col space-y-6 mt-12">
        <KeyAlert
          title="Join transaction"
          description="Joining a transaction, when all participants are here we will proceed to sign the transaction"
        />
        <MeetingPoint
          session={session}
          onMeetingPointReady={(keys, data) => {
            setPublicKeys(keys);
            setSignData(data as AssociatedData);
          }}
        />
      </div>
    </JoinSignContent>
  );
}
