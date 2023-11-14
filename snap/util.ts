import type { Json } from "@metamask/utils";

import { Wallet } from "@/lib/types";

/**
 * Find the first wallet with the given address.
 *
 * @param address - The address to validate for duplication.
 * @param wallets - The array of wallets to search for duplicate addresses.
 * @returns Returns the wallet or undefined.
 */
export function findWalletByAddress(
  address: string, wallets: Wallet[]): Wallet | undefined {
  return wallets.find((wallet) => wallet.account.address === address);
}

/**
 * Determines whether the given CAIP-2 chain ID represents an EVM-based chain.
 *
 * @param chain - The CAIP-2 chain ID to check.
 * @returns Returns true if the chain is EVM-based, otherwise false.
 */
export function isEvmChain(chain: string): boolean {
  return chain.startsWith("eip155:");
}

/**
 * Throws an error with the specified message.
 *
 * @param message - The error message.
 */
export function throwError(message: string): never {
  throw new Error(message);
}
