import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toBeHex } from "ethers";

// Utility for merging class names.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate an invitation URL.
export function inviteUrl(
    prefix: string,
    meetingId: string,
    userId: string,
    params?: Dictionary<string>,
): string {
  let url = `${location.protocol}//${location.host}/#/${prefix}/${meetingId}/${userId}`;
  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      searchParams.append(key, value);
    }
    url += `?${searchParams.toString()}`;
  }
  return url;
}

// Copy some text to the clipboard.
export async function copyToClipboard(text: string) {
  await window.navigator.clipboard.writeText(text);
}

export type Dictionary<T> = {
  [key: string]: T;
}

const chains: Dictionary<string> = {
  "0x01": "Mainnet",
  "0x03": "Ropsten",
  "0x04": "Rinkeby",
  "0x05": "Goerli",
  "0x2a": "Kovan",
  "0xaa36a7": "Sepolia",
  "0x0539": "Localhost 8545",
};

// Get human-readable chain name from it's identifier.
export function getChainName(value: string | number): string {
  return chains[toBeHex(BigInt(value))];
}

// Create a hex-encoded SHA-256 digest of a string.
export async function digest(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return toHexString(new Uint8Array(buffer));
}

// Convert from a hex-encoded string.
export function fromHexString(hex: string): Uint8Array {
  return new Uint8Array(
    hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
}

// Convert to a hex-encoded string.
export function toHexString(bytes: Uint8Array): string {
  // NOTE: calling reduce directly on Uint8Array appears to be buggy
  // NOTE: sometimes the function never returns, so we need the Array.from()
  return Array.from(bytes).reduce(
    (str: string, byte: number) => str + byte.toString(16).padStart(2, "0"),
    "",
  );
}

// Abbreviate an address or other hex identifier.
export function abbreviateAddress(address: string): string {
  const start = address.substr(0, 5);
  const end = address.substr(address.length - 5);
  return `${start}...${end}`;
}
