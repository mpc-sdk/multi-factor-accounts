// Types shared between the snap and the dapp.
import { Dictionary } from "@/lib/utils";

import type { KeyringAccount, KeyringRequest } from "@metamask/keyring-api";

import { PrivateKey } from "@/lib/schemas";
export { Parameters, PrivateKey } from "@/lib/schemas";

export type PendingRequest = {
  request: KeyringRequest;
  account: KeyringAccount;
};

export type KeyShares = Dictionary<PrivateKey>;

export type Wallet = {
  account: KeyringAccount;
  privateKey: KeyShares;
};

// FIXME: use type from schemas?
export enum ProtocolId {
  gg20 = "gg20",
}
