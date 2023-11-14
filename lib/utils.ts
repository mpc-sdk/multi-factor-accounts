import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toBeHex } from "ethers";

import { RawKey, rawKey } from "@/lib/schemas";
import { PrivateKey, ProtocolId } from "@/lib/types";
import { fromZodError } from "zod-validation-error";

// Utility for merging class names.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toUint8Array(value: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(value);
}

export function fromUint8Array(value: Uint8Array): string {
  const decoder = new TextDecoder();
  return decoder.decode(value);
}

export function download(fileName: string, buffer: Uint8Array, type?: string) {
  const blob = new Blob([buffer], { type: type || "application/octet-stream" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
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
};

const chains: Dictionary<string> = {
  "0x01": "Ethereum Mainnet",
  "0xe708": "Linea Mainnet",
  "0x03": "Ropsten",
  "0x04": "Rinkeby",
  "0x05": "Goerli",
  "0xe704": "Linea Goerli",
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
  return new Uint8Array(hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
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

// Validate raw key data and convert to the private key format.
export function convertRawKey(keyData: unknown): PrivateKey {
  try {
    const data: RawKey = rawKey.parse(keyData);
    const privateKey: PrivateKey = {
      protocolId: ProtocolId.gg20,
      address: data.address,
      publicKey: data.publicKey,
      privateKey: data.privateKey.gg20,
      keyshareId: data.privateKey.gg20.i.toString(),
      parameters: {
        parties: data.privateKey.gg20.n,
        threshold: data.privateKey.gg20.t,
      },
    };
    return privateKey;
  } catch (error) {
    const validationError = fromZodError(error);
    throw validationError;
  }
}

// Build a list of dropped files.
export function getDroppedFiles(e: React.DragEvent<HTMLElement>): File[] {
  const files = [];
  if (e.dataTransfer.items) {
    for (let i = 0; i < e.dataTransfer.items.length; i++) {
      if (e.dataTransfer.items[i].kind === "file") {
        files.push(e.dataTransfer.items[i].getAsFile());
      }
    }
  } else {
    for (let i = 0; i < e.dataTransfer.files.length; i++) {
      files.push(e.dataTransfer.files[i]);
    }
  }
  return files;
}

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function humanFileSize(bytes: number, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}
