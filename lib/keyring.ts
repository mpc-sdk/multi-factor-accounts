import snapId from '@/lib/snap-id';
import { KeyringSnapRpcClient } from '@metamask/keyring-api';

const getKeyringClient = () =>
  new KeyringSnapRpcClient(snapId, ethereum);

export async function createAccount(address: string, privateKey: string) {
  const client = getKeyringClient();
  console.log("Calling createAccount on keyring client...",
    address, privateKey);
  const newAccount = await client.createAccount({ address, privateKey });
  console.log("newAccount", newAccount);
}
