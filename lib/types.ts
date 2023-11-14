// Types shared between the snap and the dapp.
import { Dictionary } from '@/lib/utils';

import { LocalKey } from '@/lib/schemas';

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

// Key parameters.
export type Parameters = {
  parties: number;
  threshold: number;
};

export type PrivateKey = {
  protocolId: ProtocolId;
  privateKey: LocalKey;
  publicKey: string;
  keyshareId: string;
  address: string;
  parameters: Parameters;
}
