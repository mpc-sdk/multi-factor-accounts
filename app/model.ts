//import { Transaction, TransactionReceiptParams } from "ethers";
import { Parameters, LocalKey } from "@/lib/types";

// Noise protocol key information.
export type Keypair = {
  // Full key material pem-encoded.
  pem: string;
  // Hex-encoded public key intended for debugging.
  publicKey: string;
};

// Participant public keys are hex-encoded strings.
export type PublicKeys = string[];

// Supported protocols.
export enum Protocol {
  gg20 = "gg20",
}

export type KeygenOptions = {
  server: ServerOptions;
  protocol: Protocol;
  keypair: string;
  parameters: Parameters;
};

export type SignOptions = {
  server: ServerOptions;
  protocol: Protocol;
  keypair: string;
  parameters: Parameters;
};

// Types of sessions.
export enum SessionType {
  // Key generation session.
  keygen = "keygen",
  // Signing session.
  sign = "sign",
}

// Intended audience for a key share.
export enum KeyShareAudience {
  self = "self",
  shared = "shared",
}

// Type discriminant for session types.
export enum OwnerType {
  // Initiator of session.
  initiator = "initiator",
  // Participant in session.
  participant = "participant",
}

// State for the create key flow (initiator).
export type CreateKeyState = {
  ownerType: OwnerType;
  sessionType: SessionType;
  audience?: KeyShareAudience;
  name?: string;
  parties?: number;
  threshold?: number;
};

// Parameters for joining a meeting.
export type JoinMeeting = {
  meetingId: string;
  userId: string;
};

// State for the create key flow (participant).
export type JoinKeyState = JoinMeeting & {
  ownerType: OwnerType;
  sessionType: SessionType;
};

// Associated data for a session passed via the meeting point.
export type AssociatedData = Map<string, unknown>;

// Aliases for sign session states.
export type CreateSignState = CreateKeyState;
export type JoinSignState = JoinKeyState;

export type SessionState =
  | CreateKeyState
  | JoinKeyState
  | CreateSignState
  | JoinSignState;

// Information about a meeting point.
export type MeetingInfo = {
  meetingId: string;
  identifiers: string[];
};

// Options for connecting to server.
export type ServerOptions = {
  serverUrl: string;
  serverPublicKey: string;
};

// Options for creating a meeting point.
export type MeetingOptions = {
  server: ServerOptions;
  keypair: string;
};

// Private key share.
export type KeyShare = {
  localKey: LocalKey;
  publicKey: number[];
  address: string;
};

/*
// Opaque type for the private key share.
export type LocalKey = {
  // Index of the key share.
  i: number;
  // Threshold for key share signing.
  t: number;
  // Total number of parties.
  n: number;
};
*/

// Result of signing a message.
export type SignatureRecId = {
  r: SignPrimitive;
  s: SignPrimitive;
  recid: number;
};

export type SignPrimitive = {
  // For ECDSA should be `secp256k1`.
  curve: string;
  // Hex-encoded bytes.
  scalar: string;
};

// Result of signing a message.
export type Signature = {
  signature: SignatureRecId;
  publicKey: number[];
  address: string;
};

export type ProtocolSignature = {
  gg20: Signature;
};

export type ProtocolLocalKey = {
  gg20: LocalKey;
};

/*
// Key share with a human-friendly label.
export type NamedKeyShare = {
  label: string;
  share: KeyShare;
};

export type SignProof = {
  signature: SignResult;
  address: string;
  value: SignValue;
  timestamp: number;
};

export type SignTxReceipt = {
  signature: SignResult;
  address: string;
  amount: string;
  // WARN: Storing the transaction is not possible at the moment
  // WARN: due to a typescript error with #private in the type
  // WARN: definition
  //tx: SignTransaction,
  value: TransactionReceiptParams;
  timestamp: number;
};

// Maps message signing proofs from key address.
export type MessageProofs = {
  [key: string]: SignProof[];
};

// Maps transaction receipts from key address.
export type TransactionReceipts = {
  [key: string]: SignTxReceipt[];
};

// Application state that can be persisted to disc by the snap backend.
export type AppState = {
  keyShares: NamedKeyShare[];
  messageProofs: MessageProofs;
  transactionReceipts: TransactionReceipts;
};

// Message to be signed.
export type SignMessage = {
  message: string;
  digest: Uint8Array;
};

export enum SigningType {
  MESSAGE = "message",
  TRANSACTION = "transaction",
}

// Type for signing transactions
export type SignTransaction = {
  transaction: Transaction;
  digest: Uint8Array;
};

export type SignValue = SignMessage | SignTransaction;
*/
