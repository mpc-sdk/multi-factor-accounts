import React from "react";
import { formatEther, TransactionLike } from "ethers";
import { KeyringAccount } from "@metamask/keyring-api";

import AddressBadge from "@/components/AddressBadge";
import { useBalance } from "@/app/hooks";

export function TransactionFromPreview({
  account,
}: {
  account: KeyringAccount;
}) {
  const balance = useBalance(account.address);
  if (balance === null) return;

  const accountName = (account?.options?.name as string) ?? "Untitled account";
  return (
    <div className="flex flex-col space-y-2 mt-6 p-4 rounded-md border">
      <div className="flex justify-between">
        <div>{accountName}</div>
        <AddressBadge address={account.address} />
      </div>
      <div className="flex justify-between">
        <div>Balance</div>
        <div>{formatEther(balance)} ETH</div>
      </div>
    </div>
  );
}

export default function TransactionPreview({ tx }: { tx: TransactionLike }) {
  return (
    <div className="flex flex-col space-y-2 mt-6 p-4 rounded-md border">
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
    </div>
  );
}
