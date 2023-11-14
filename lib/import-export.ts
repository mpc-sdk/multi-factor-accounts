// Utilities for importing and exporting accounts.
import { ToasterToast } from "@/components/ui/use-toast";

import { getWalletByAddress } from "@/lib/keyring";
import { toUint8Array, download } from "@/lib/utils";
import guard from '@/lib/guard';

export async function exportAccount (
  address: string,
  toast: (val: ToasterToast) => void,
) {
  await guard(async () => {
    const wallet = await getWalletByAddress(address);
    const fileName = `${address}.json`;
    const value = JSON.stringify(wallet, undefined, 2);
    download(fileName, toUint8Array(value));
  }, toast);
}
