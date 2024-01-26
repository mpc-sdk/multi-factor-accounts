import React, { Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TransactionLike } from "ethers";

import { useToast } from "@/components/ui/use-toast";
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

import guard from "@/lib/guard";
import { getPendingRequest, rejectRequest } from "@/lib/keyring";
import { getChainName } from "@/lib/utils";
import use from "@/lib/react-use";
import { PendingRequest } from "@/lib/types";

function ApproveRequestContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Heading>Approve Transaction</Heading>
      {children}
    </>
  );
}

function ApproveRequestBody({
  resource,
}: {
  resource: Promise<PendingRequest | null>;
}) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const result = use(resource);
  const { request: pendingRequest, account } = result;

  if (!pendingRequest || !account) {
    return <NotFound />;
  }

  const rejectPendingRequest = async (id: string) => {
    await guard(async () => {
      await rejectRequest(id);
      navigate("/");
    }, toast);
  };

  const method = pendingRequest.request && pendingRequest.request.method;
  if (method !== "eth_signTransaction") {
    return (
      <ApproveRequestContent>
        <div className="flex flex-col space-y-6 mt-12">
          <p>Signing method {method} is not supported</p>
        </div>
      </ApproveRequestContent>
    );
  }

  const transactionData = pendingRequest.request.params[0] || null;
  if (!transactionData) {
    return (
      <ApproveRequestContent>
        <div className="flex flex-col space-y-6 mt-12">
          <p>Invalid transaction data.</p>
        </div>
      </ApproveRequestContent>
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
    <ApproveRequestContent>
      <Badges />
      <div className="flex flex-col space-y-6 mt-12">
        <KeyAlert
          title="Approve request"
          description="Approve the transaction to continue"
        />
        <TransactionFromPreview account={account} />
        <TransactionPreview tx={tx} />
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => rejectPendingRequest(pendingRequest.id)}
          >
            Reject
          </Button>
          <Link href={`/sign/${pendingRequest.id}`}>
            <Button>Approve</Button>
          </Link>
        </div>
      </div>
    </ApproveRequestContent>
  );
}

function LoadRequest({ requestId }: { requestId: string }) {
  const resource = getPendingRequest(requestId);
  return (
    <Suspense fallback={<Loader text="Loading signing request..." />}>
      <ApproveRequestBody resource={resource} />
    </Suspense>
  );
}

export default function ApproveRequest() {
  const { requestId } = useParams();
  if (!requestId) {
    return <NotFound />;
  }
  return <LoadRequest requestId={requestId} />;
}
