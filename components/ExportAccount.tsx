import React from "react";
import type { KeyringAccount } from "@metamask/keyring-api";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import Icons from "@/components/Icons";

import { exportAccount } from "@/lib/keyring";
import { PrivateKey, KeyShares } from "@/lib/types";
import { toUint8Array, download, keyShareAddress } from "@/lib/utils";
import guard from "@/lib/guard";

function downloadKeyShares(
  address: string,
  privateKey: KeyShares,
  keyShareId?: string,
) {
  const exportedAccount = { privateKey };
  let fileName = `${address}.json`;
  if (keyShareId) {
    fileName = `${address}-${keyShareId}.json`;
  }
  const value = JSON.stringify(exportedAccount, undefined, 2);
  download(fileName, toUint8Array(value));
}

function AlertHeader() {
  return (
    <AlertDialogHeader>
      <AlertDialogTitle>Export account</AlertDialogTitle>
      <AlertDialogDescription>
        Exporting this account will download the private key to your
        computer unencrypted; you should copy the file to safe encrypted
        storage such as a password manager and delete the downloaded file
        from your disc.
      </AlertDialogDescription>
    </AlertDialogHeader>
  );
}

export function DownloadKeyShare({
  keyShare,
  buttonText,
}: {
  keyShare: PrivateKey,
  buttonText?: string
}) {
  const { toast } = useToast();

  const downloadKeyShare = async () => {
    await guard(async () => {
      const { address } = keyShare;
      const { i: keyShareId } = keyShare.privateKey;
      const keyShares: KeyShares = {};
      keyShares[keyShareId.toString()] = keyShare;
      await downloadKeyShares(address, keyShares, keyShareId.toString());
    }, toast);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Icons.download className={`h-4 w-4 ${buttonText !== undefined ? "mr-2" : ""}`} />
          {buttonText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertHeader />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={downloadKeyShare}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function ExportAccount({
  account,
  buttonText,
  keyShareId,
}: {
  account: KeyringAccount
  buttonText?: string
  keyShareId?: string
}) {
  const { toast } = useToast();

  const downloadAccount = async () => {
    await guard(async () => {
      const wallet = (await exportAccount(account.id)) as KeyShares;

      const addresses = keyShareAddress(wallet);
      const address = addresses[0];
      if (!address) {
        throw new Error("Unable to determine address from key shares");
      }

      let privateKey = wallet;
      if (keyShareId) {
        const keySharePrivateKey = privateKey[keyShareId];
        privateKey = {};
        privateKey[keyShareId] = keySharePrivateKey;
      }

      downloadKeyShares(address, privateKey, keyShareId);
    }, toast);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Icons.download className={`h-4 w-4 ${buttonText !== undefined ? "mr-2" : ""}`} />
          {buttonText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertHeader />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={downloadAccount}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

