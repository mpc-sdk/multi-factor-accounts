import snapId from "@/lib/snap-id";
import { KeyringSnapRpcClient } from "@metamask/keyring-api";

import type { KeyringAccount } from "@metamask/keyring-api";

const getKeyringClient = () => new KeyringSnapRpcClient(snapId, ethereum);

export async function createAccount(address: string, privateKey: string) {
  const client = getKeyringClient();
  console.log(
    "Calling createAccount on keyring client...",
    address,
    privateKey,
  );
  const newAccount = await client.createAccount({ address, privateKey });
  console.log("newAccount", newAccount);
}

export async function listAccounts(): Promise<KeyringAccount[]> {
  const client = getKeyringClient();
  return await client.listAccounts();
}

export async function getWalletByAddress(address: string): Promise<unknown> {
  return await ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId,
      request: {
        method: 'snap.internal.getWalletByAddress',
        params: { address },
      },
    },
  });
};
