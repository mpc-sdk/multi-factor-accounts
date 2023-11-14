// Types shared between the snap and the dapp.
import { Dictionary } from '@/lib/utils';

import type {
  KeyringAccount,
} from "@metamask/keyring-api";

export type Wallet = {
  account: KeyringAccount;
  privateKey: Dictionary<PrivateKey>;
};

export enum ProtocolId {
  gg20 = "gg20",
}

export type PrivateKey = {
  protocolId: ProtocolId;
  privateKey: LocalKey;
  publicKey: number[];
  keyshareId: string;
  address: string;
}

// Opaque type for the private key share.
export type LocalKey = {
  // Index of the key share.
  i: number;
  // Threshold for key share signing.
  t: number;
  // Total number of parties.
  n: number;
};

