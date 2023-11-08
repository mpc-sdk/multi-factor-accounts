import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toBeHex } from "ethers";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Dictionary<T> = {
  [key: string]: T;
};

const chains: Dictionary<string> = {
  "0x01": "Mainnet",
  "0x03": "Ropsten",
  "0x04": "Rinkeby",
  "0x05": "Goerli",
  "0x2a": "Kovan",
  "0xaa36a7": "Sepolia",
  "0x0539": "Localhost 8545",
};

export function getChainName(value: string | number): string {
  return chains[toBeHex(BigInt(value))];
}

/// Create a hex-encoded SHA-256 digest of a string.
export async function digest(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return toHexString(new Uint8Array(buffer));
}

export function fromHexString(hex: string): Uint8Array {
  return new Uint8Array(
    hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
}

export function toHexString(bytes: Uint8Array): string {
  // NOTE: calling reduce directly on Uint8Array appears to be buggy
  // NOTE: sometimes the function never returns, so we need the Array.from()
  return Array.from(bytes).reduce(
    (str: string, byte: number) => str + byte.toString(16).padStart(2, "0"),
    ""
  );
}
