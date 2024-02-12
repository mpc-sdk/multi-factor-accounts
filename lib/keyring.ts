import { defaultSnapId as snapId } from "@/lib/snap";
import { TransactionLike } from "ethers";
import { Json } from "@metamask/utils";
import {
  KeyringAccount,
  KeyringSnapRpcClient,
  KeyringAccountData,
  KeyringRequest,
} from "@metamask/keyring-api";
import type { MetaMaskInpageProvider } from '@metamask/providers';

import { ResponseSignature, Wallet, PrivateKey, PendingRequest } from "@/lib/types";

const getKeyringClient = () => new KeyringSnapRpcClient(snapId, ethereum as MetaMaskInpageProvider);

export async function createAccount(privateKey: PrivateKey, name: string) {
  const client = getKeyringClient();
  await client.createAccount({ privateKey, name });
  //console.log("newAccount", newAccount);
}

export async function listAccounts(): Promise<KeyringAccount[]> {
  const client = getKeyringClient();
  return await client.listAccounts();
}

export async function deleteAccount(id: string): Promise<void> {
  const client = getKeyringClient();
  return await client.deleteAccount(id);
}

export async function updateAccount(account: KeyringAccount): Promise<void> {
  const client = getKeyringClient();
  return await client.updateAccount(account);
}

export async function listRequests(): Promise<KeyringRequest[]> {
  const client = getKeyringClient();
  return await client.listRequests();
}

export async function getRequest(id: string): Promise<KeyringRequest | null> {
  const client = getKeyringClient();
  return await client.getRequest(id);
}

export async function rejectRequest(id: string): Promise<void> {
  const client = getKeyringClient();
  return await client.rejectRequest(id);
}

export async function approveRequest(
  id: string,
  result: ResponseSignature,
): Promise<void> {
  const client = getKeyringClient();
  return await client.approveRequest(id, { result: result as Json });
}

export async function getPendingRequest(
  id: string,
): Promise<PendingRequest | null> {
  const client = getKeyringClient();
  const request = await client.getRequest(id);
  if (request) {
    const tx = (request.request.params as Json[])[0] as TransactionLike;
    const address = tx.from;
    const account = await getAccountByAddress(address);
    return { request, account };
  }
  return null;
}

export async function deleteKeyShare(
  id: string,
  keyShareId: string,
): Promise<boolean> {
  return (await ethereum.request({
    method: "wallet_invokeSnap",
    params: {
      snapId,
      request: {
        method: "snap.internal.deleteKeyShare",
        params: { id, keyShareId },
      },
    },
  })) as boolean;
}

export async function exportAccount(id: string): Promise<KeyringAccountData> {
  const client = getKeyringClient();
  return await client.exportAccount(id);
}

export async function getAccountByAddress(
  address: string,
): Promise<KeyringAccount> {
  return (await ethereum.request({
    method: "wallet_invokeSnap",
    params: {
      snapId,
      request: {
        method: "snap.internal.getAccountByAddress",
        params: { address },
      },
    },
  })) as KeyringAccount;
}

export async function getWalletByAddress(address: string): Promise<Wallet> {
  return (await ethereum.request({
    method: "wallet_invokeSnap",
    params: {
      snapId,
      request: {
        method: "snap.internal.getWalletByAddress",
        params: { address },
      },
    },
  })) as Wallet;
}
