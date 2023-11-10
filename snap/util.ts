import type { Json } from '@metamask/utils';

import type { Wallet } from './keyring';

/**
 * Validates whether there are no duplicate addresses
 * in the provided array of wallets.
 *
 * @param address - The address to validate for duplication.
 * @param wallets - The array of wallets to search for duplicate addresses.
 * @returns Returns true if no duplicate addresses are found, otherwise false.
 */
export function isUniqueAddress(address: string, wallets: Wallet[]): boolean {
  return !wallets.find((wallet) => wallet.account.address === address);
}

/**
 * Determines whether the given CAIP-2 chain ID represents an EVM-based chain.
 *
 * @param chain - The CAIP-2 chain ID to check.
 * @returns Returns true if the chain is EVM-based, otherwise false.
 */
export function isEvmChain(chain: string): boolean {
  return chain.startsWith('eip155:');
}

/**
 * Throws an error with the specified message.
 *
 * @param message - The error message.
 */
export function throwError(message: string): never {
  throw new Error(message);
}
