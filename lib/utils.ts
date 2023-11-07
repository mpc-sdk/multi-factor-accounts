import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toBeHex } from 'ethers';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export function getChainName(value: string | number): string {
  return chains[toBeHex(BigInt(value))];
}
