import React from "react";
import { useDispatch } from "react-redux";
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

import { invalidateAccounts } from "@/app/store/accounts";
import { deleteAccount, deleteKeyShare } from "@/lib/keyring";
import guard from "@/lib/guard";

export default function DeleteAccount({
  account,
  onDeleted,
  buttonText,
  keyShareId,
}: {
  account: KeyringAccount;
  onDeleted: (accountDeleted: boolean) => void;
  buttonText?: string;
  keyShareId?: string;
}) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const shares = account.options.shares as string[];
  const isKeyShare = keyShareId && shares.length > 1;

  const removeAccount = async () => {
    await guard(async () => {
      if (isKeyShare) {
        const accountDeleted = await deleteKeyShare(account.id, keyShareId);
        await dispatch(invalidateAccounts());
        onDeleted(accountDeleted);
      } else {
        await deleteAccount(account.id);
        await dispatch(invalidateAccounts());
        onDeleted(true);
      }
    }, toast);
  };

  const icon = isKeyShare ? (
    <Icons.remove
      className={`h-4 w-4 ${buttonText !== undefined ? "mr-2" : ""}`}
    />
  ) : (
    <Icons.trash
      className={`h-4 w-4 ${buttonText !== undefined ? "mr-2" : ""}`}
    />
  );

  const title = isKeyShare ? (
    <AlertDialogTitle>Delete key share</AlertDialogTitle>
  ) : (
    <AlertDialogTitle>Delete account</AlertDialogTitle>
  );

  const description = isKeyShare ? (
    <AlertDialogDescription>
      Deleting a key share is permananent you should export a backup copy of the
      key share first if you want to be able to import it later.
    </AlertDialogDescription>
  ) : (
    <AlertDialogDescription>
      Deleting an account is permanent consider exporting the account key shares
      first.
    </AlertDialogDescription>
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          {icon}
          {buttonText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          {title}
          {description}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild onClick={removeAccount}>
            <Button variant="destructive">Continue</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
