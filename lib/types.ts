// Types shared between the snap and the dapp.

import type {
  KeyringAccount,
} from "@metamask/keyring-api";

export type PrivateKey = string;

export type Wallet = {
  account: KeyringAccount;
  privateKey: PrivateKey;
};
