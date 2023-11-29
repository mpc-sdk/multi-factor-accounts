import type {
  Keyring,
  KeyringAccount,
  KeyringAccountData,
  KeyringRequest,
  SubmitRequestResponse,
} from "@metamask/keyring-api";

import {
  EthAccountType,
  EthMethod,
  emitSnapKeyringEvent,
} from "@metamask/keyring-api";

import { KeyringEvent } from "@metamask/keyring-api/dist/events";
import { type Json, type JsonRpcRequest } from "@metamask/utils";
import { v4 as uuid } from "uuid";

import { saveState } from "./stateManagement";

import packageInfo from "../package.json";

import { Wallet, PrivateKey } from "@/lib/types";

/**
 * Throws an error with the specified message.
 *
 * @param message - The error message.
 */
export function throwError(message: string): never {
  throw new Error(message);
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

export type KeyringState = {
  wallets: Record<string, Wallet>;
  pendingRequests: Record<string, KeyringRequest>;
};

export class ThresholdKeyring implements Keyring {
  #state: KeyringState;

  constructor(state: KeyringState) {
    this.#state = state;
  }

  async listAccounts(): Promise<KeyringAccount[]> {
    return Object.values(this.#state.wallets).map((wallet) => wallet.account);
  }

  async getAccount(id: string): Promise<KeyringAccount> {
    return (
      this.#state.wallets[id]?.account ??
      throwError(`Account '${id}' not found`)
    );
  }

  // Add a private key share to an account using an upsert.
  //
  // Creates the account if it does not exist otherwise creates
  // or overwrites the key share.
  async createAccount(
    options: Record<string, Json> = {},
  ): Promise<KeyringAccount> {
    const privateKey = options?.privateKey as PrivateKey;

    if (!privateKey) {
      throw new Error(`Private key share must be given to create an account.`);
    }

    const { address, keyshareId } = privateKey;

    if (!address) {
      throw new Error(`Address  must be given to create an account.`);
    }

    if (!keyshareId) {
      throw new Error(
        `Key share identifier must be given to create an account.`,
      );
    }

    // The private key should not be stored in the account options since the
    // account object is exposed to external components, such as MetaMask and
    // the snap UI.
    const { parameters } = privateKey;
    delete options.privateKey;
    options.parameters = parameters;

    try {
      const existingWallet = this.findWalletByAddress(address);

      const account: KeyringAccount =
        existingWallet !== undefined
          ? existingWallet.account
          : {
              id: uuid(),
              options,
              address,
              methods: [
                EthMethod.PersonalSign,
                EthMethod.Sign,
                EthMethod.SignTransaction,
                //EthMethod.SignTypedDataV1,
                //EthMethod.SignTypedDataV3,
                //EthMethod.SignTypedDataV4,
              ],
              type: EthAccountType.Eoa,
            };

      let wallet: Wallet = { account, privateKey: {} };
      wallet.privateKey[keyshareId] = privateKey;
      if (existingWallet) {
        existingWallet.privateKey[keyshareId] = privateKey;
        wallet = existingWallet;
      }

      // Keep track of the share identifiers
      account.options.shares = Object.keys(wallet.privateKey);

      if (!existingWallet) {
        await this.#emitEvent(KeyringEvent.AccountCreated, { account });
      } else {
        await this.#emitEvent(KeyringEvent.AccountUpdated, { account });
      }
      this.#state.wallets[account.id] = wallet;
      await this.#saveState();
      return account;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async filterAccountChains(_id: string, chains: string[]): Promise<string[]> {
    // The `id` argument is not used because all accounts created by this snap
    // are expected to be compatible with any EVM chain.
    return chains.filter((chain) => isEvmChain(chain));
  }

  async updateAccount(account: KeyringAccount): Promise<void> {
    const wallet =
      this.#state.wallets[account.id] ??
      throwError(`Account '${account.id}' not found`);

    const newAccount: KeyringAccount = {
      ...wallet.account,
      ...account,
      // Restore read-only properties.
      address: wallet.account.address,
    };

    try {
      await this.#emitEvent(KeyringEvent.AccountUpdated, {
        account: newAccount,
      });
      wallet.account = newAccount;
      await this.#saveState();
    } catch (error) {
      throwError((error as Error).message);
    }
  }

  async deleteAccount(id: string): Promise<void> {
    try {
      await this.#emitEvent(KeyringEvent.AccountDeleted, { id });
      delete this.#state.wallets[id];
      await this.#saveState();
    } catch (error) {
      throwError((error as Error).message);
    }
  }

  /**
   *  Delete a key share by identifier.
   *
   *  If the key share is the last remaining key share the entire account
   *  is removed.
   *
   *  Returns true if the account was deleted.
   */
  async deleteKeyShare(id: string, keyShareId: string): Promise<boolean> {
    try {
      const wallet = this.#state.wallets[id];
      delete wallet?.privateKey[keyShareId];
      const { account } = wallet;
      account.options.shares = Object.keys(wallet.privateKey);
      // Deleting the last share so completely remove the account
      if (account.options.shares.length === 0) {
        await this.deleteAccount(id);
        return true;
      } else {
        await this.#emitEvent(KeyringEvent.AccountUpdated, { account });
        this.#state.wallets[id] = wallet;
        await this.#saveState();
        return false;
      }
    } catch (error) {
      throwError((error as Error).message);
    }
  }

  async listRequests(): Promise<KeyringRequest[]> {
    return Object.values(this.#state.pendingRequests);
  }

  async getRequest(id: string): Promise<KeyringRequest> {
    return (
      this.#state.pendingRequests[id] ?? throwError(`Request '${id}' not found`)
    );
  }

  async submitRequest(request: KeyringRequest): Promise<SubmitRequestResponse> {
    console.log("SUBMIT REQUEST WAS CALLED...");

    this.#state.pendingRequests[request.id] = request;
    await this.#saveState();
    const dappUrl = this.#getCurrentUrl();

    return {
      pending: true,
      redirect: {
        url: dappUrl,
        message: "Redirecting to multi-factor accounts snap to sign transaction",
      },
    };
  }

  async approveRequest(id: string): Promise<void> {
    const { request } =
      this.#state.pendingRequests[id] ??
      throwError(`Request '${id}' not found`);

    console.log("APPROVE REQUEST WAS CALLED...");

    //const result = this.#handleSigningRequest(
    //request.method,
    //request.params ?? [],
    //);
    const result = "TODO: handle request data";

    await this.#removePendingRequest(id);
    await this.#emitEvent(KeyringEvent.RequestApproved, { id, result });
  }

  async rejectRequest(id: string): Promise<void> {
    if (this.#state.pendingRequests[id] === undefined) {
      throw new Error(`Request '${id}' not found`);
    }

    await this.#removePendingRequest(id);
    await this.#emitEvent(KeyringEvent.RequestRejected, { id });
  }

  async #removePendingRequest(id: string): Promise<void> {
    delete this.#state.pendingRequests[id];
    await this.#saveState();
  }

  #getCurrentUrl(): string {
    const dappUrlPrefix =
      process.env.NODE_ENV === "production"
        ? process.env.DAPP_ORIGIN_PRODUCTION
        : process.env.DAPP_ORIGIN_DEVELOPMENT;

    /*
    const dappVersion: string = packageInfo.version;
    // Ensuring that both dappUrlPrefix and dappVersion are truthy
    if (dappUrlPrefix && dappVersion && process.env.NODE_ENV === "production") {
      return `${dappUrlPrefix}/${dappVersion}/`;
    }
    */

    // Default URL if dappUrlPrefix or dappVersion are falsy,
    // or if URL construction fails
    return dappUrlPrefix as string;
  }

  async exportAccount(id: string): Promise<KeyringAccountData> {
    const wallet =
      this.#state.wallets[id] || throwError(`Account ${id} does not exist`);
    return wallet.privateKey as KeyringAccountData;
  }

  /**
   * Find the first wallet with the given address.
   *
   * @param address - The address to validate for duplication.
   * @param wallets - The array of wallets to search for duplicate addresses.
   * @returns Returns the wallet or undefined.
   */
  findWalletByAddress(address: string): Wallet | undefined {
    return Object.values(this.#state.wallets).find(
      (wallet) => wallet.account.address === address,
    );
  }

  getWalletByAddress(address: string): Wallet {
    const match = this.findWalletByAddress(address);
    return match ?? throwError(`Account '${address}' not found`);
  }

  async #saveState(): Promise<void> {
    await saveState(this.#state);
  }

  async #emitEvent(
    event: KeyringEvent,
    data: Record<string, Json>,
  ): Promise<void> {
    await emitSnapKeyringEvent(snap, event, data);
  }
}
