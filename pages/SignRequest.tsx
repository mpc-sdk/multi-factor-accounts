import React, { useEffect, useState, useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { formatEther, Transaction } from 'ethers';

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import Loader from "@/components/Loader";
import Heading from "@/components/Heading";
import KeyAlert from "@/components/KeyAlert";
import AddressBadge from "@/components/AddressBadge";

import {
  PublicKeys,
  AssociatedData,
  SessionState,
  OwnerType,
  SessionType,
} from "@/app/model";

import NotFound from "@/pages/NotFound";

import guard from "@/lib/guard";
import { getRequest } from "@/lib/keyring";
import { getChainName } from "@/lib/utils";

function SignRequestContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Heading>Sign Request</Heading>
      {children}
    </>
  );
}

function TransactionPreview( { tx }: { tx: Transaction } ) {
  return <div className="flex flex-col space-y-2 mt-6 p-4 rounded-md border">
    <div className="flex justify-between">
      <div>To</div>
      <div>{tx.to}</div>
    </div>
    <div className="flex justify-between">
      <div>Amount</div>
      <div>{formatEther(tx.value)} ETH</div>
    </div>
    <div className="flex justify-between">
      <div>Max fee</div>
      <div>{formatEther(tx.maxFeePerGas)} ETH</div>
    </div>
    <div className="flex justify-between">
      <div>Max priority fee</div>
      <div>{formatEther(tx.maxPriorityFeePerGas)} ETH</div>
    </div>
    <div className="flex justify-between">
      <div>Gas limit</div>
      <div>{formatEther(tx.gasLimit)} ETH</div>
    </div>
  </div>;
}

export default function SignRequest() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [pendingRequest, setPendingRequest] = useState(null);
  const { requestId } = useParams();

  useEffect(() => {
    const loadRequest = async () => {
      const request = await getRequest(requestId);
      setLoading(false);
      setPendingRequest(request);
    };

    loadRequest();
  }, []);

  // b230bbd4-a6fa-4a91-9f2d-f0cdf73fd21a

  console.log("requestId", requestId);

  //const [searchParams] = useSearchParams();
  //const name = searchParams.get("name");

  //if (keypair === null) {
    //return null;
  //}
  //const { publicKey } = keypair;

  if (!requestId) {
    return <NotFound />;
  }

  if (loading) {
    return <Loader text="Loading signing request..." />
  }

  if (!pendingRequest) {
    return <NotFound />;
  }

  const method = pendingRequest.request && pendingRequest.request.method;
  if (method !== "eth_signTransaction") {
    return <SignRequestContent>
      <div className="flex flex-col space-y-6 mt-12">
        <p>Signing method {method} is not supported</p>
      </div>
    </SignRequestContent>
  }

  const transactionData = pendingRequest.request.params[0] || null;
  if (!transactionData) {
    return <SignRequestContent>
      <div className="flex flex-col space-y-6 mt-12">
        <p>Invalid transaction data.</p>
      </div>
    </SignRequestContent>
  }

  const tx = transactionData as Transaction;

  const chainName = getChainName(tx.chainId);
  const Badges = () => (
    <div className="flex justify-between items-center mt-2">
      {chainName && <Badge>{chainName}</Badge>}
      <AddressBadge address={tx.from} />
    </div>
  );

  return (
    <SignRequestContent>
      <Badges />
      <div className="flex flex-col space-y-6 mt-12">
        <KeyAlert
          title="Sign request"
          description="Approve the signing request to continue"
        />
        <TransactionPreview tx={tx} />
        <div className="flex justify-end">
          <Button>Sign Transaction</Button>
        </div>
      </div>
    </SignRequestContent>
  );
}
