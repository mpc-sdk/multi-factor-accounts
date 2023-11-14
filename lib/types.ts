// Types shared between the snap and the dapp.
import { Dictionary } from "@/lib/utils";

import type { KeyringAccount } from "@metamask/keyring-api";

import { PrivateKey } from "@/lib/schemas";
export { Parameters, PrivateKey } from "@/lib/schemas";

export type Wallet = {
  account: KeyringAccount;
  privateKey: Dictionary<PrivateKey>;
};

// FIXME: use type from schemas?
export enum ProtocolId {
  gg20 = "gg20",
}

/*
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
};
*/
