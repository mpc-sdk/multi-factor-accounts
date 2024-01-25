import React, { Suspense, useState, useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { TransactionLike } from "ethers";
import { KeyringAccount } from "@metamask/keyring-api";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

import { KeypairContext } from "@/app/providers/keypair";
import Heading from "@/components/Heading";
import Loader from "@/components/Loader";
import ChooseKeyShare from "@/components/ChooseKeyShare";
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
import { getAccountByAddress, getWalletByAddress } from "@/lib/keyring";
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

function SigningCompleted({
  account,
  tx,
  badges,
}: {
  account: KeyringAccount;
  tx: TransactionLike;
  badges: React.ReactNode;
}) {
  return (
    <JoinSignContent>
      {badges}
      <div className="flex flex-col space-y-6 mt-12">
        <KeyAlert
          title="Transaction Signed"
          description="The transaction has been signed, the initiator must submit the transaction for processing."
        />
        <TransactionFromPreview account={account} tx={tx} />
        <TransactionPreview tx={tx} />
      </div>
    </JoinSignContent>
  );
}

function ReviewTransaction({
  account,
  tx,
  badges,
  remainingShares,
  onApproved,
}: {
  account: KeyringAccount;
  tx: TransactionLike;
  badges: React.ReactNode;
  remainingShares: string[];
  onApproved: (shareId: string) => void;
}) {
  const button = remainingShares.length === 1
    ? <Button onClick={() => onApproved(remainingShares[0])}>Approve Transaction</Button>
    : <ChooseKeyShare
        account={account}
        shares={remainingShares}
        onConfirm={onApproved}
        button={<Button>Approve Transaction</Button>} />

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
          {button}
        </div>
      </div>
    </JoinSignContent>
  );
}

function JoinSignWithAccount({
  tx,
  transaction,
  resource,
  publicKeys,
  badges,
  initiatorKeyShareId,
}: {
  tx: TransactionLike;
  transaction: string;
  resource: Promise<KeyringAccount | null>;
  publicKeys: PublicKeys;
  badges: React.ReactNode;
  initiatorKeyShareId: string;
}) {
  const { toast } = useToast();
  const [shareId, setShareId] = useState(null);
  const [signature, setSignature] = useState(null);
  const account = use(resource);
  if (!account) {
    return <NotFound />;
  }

  if (signature !== null) {
    return <SigningCompleted account={account} tx={tx} badges={badges} />;
  }

  const shares = account.options.shares as string[];
  const remainingShares = shares.filter(
    (shareId: string) => shareId !== initiatorKeyShareId,
  );

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
          `signing key not found for ${account.address} with key share id ${shareId}`,
        );
      }

      const signature = await sign(
        worker,
        serverUrl,
        null, // Participants MUST be null when joining
        signingKey,
        transaction,
      );

      setSignature(signature);
    }, toast);
  };

  if (shareId !== null) {
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
      remainingShares={remainingShares}
      onApproved={(shareId) => setShareId(shareId)}
    />
  );
}

function JoinSignLoadAccount({
  tx,
  transaction,
  publicKeys,
  badges,
  initiatorKeyShareId,
}: {
  tx: TransactionLike;
  transaction: string;
  publicKeys: PublicKeys;
  badges: React.ReactNode;
  initiatorKeyShareId: string;
}) {
  const resource = getAccountByAddress(tx.from);
  return (
    <Suspense fallback={<Loader text="Loading account..." />}>
      <JoinSignWithAccount
        tx={tx}
        transaction={transaction}
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
  const transaction = signData && (signData.get("transaction") as string);
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
  if (transaction && tx && encodedTransaction !== transaction) {
    throw new Error(
      "transaction mismatch, hash does not match transaction data",
    );
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
        threshold={signData && (signData.get("threshold") as number) + 1}
      />
      <PublicKeyBadge publicKey={publicKey} />
    </div>
  );

  if (tx) {
    return (
      <JoinSignLoadAccount
        tx={tx}
        transaction={transaction}
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
