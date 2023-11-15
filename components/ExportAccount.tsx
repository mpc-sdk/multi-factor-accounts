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
import guard  from "@/lib/guard";

export default function ExportAccount({
  account,
}: {
  account: KeyringAccount;
}) {
  const { toast } = useToast();

  const downloadAccount = async () => {
    await guard(async () => {
      const data = await exportAccount(account.id);
      console.log(data);
    }, toast);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Icons.download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Export account</AlertDialogTitle>
          <AlertDialogDescription>
            Exporting this account will download the private key to your
            computer unencrypted; you should copy the file to safe encrypted
            storage such as a password manager and delete the downloaded file
            from your disc.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => exportAccount(account.address, toast)}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
