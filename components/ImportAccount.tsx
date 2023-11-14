import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { KeyringAccount } from "@metamask/keyring-api";

import { fromZodError } from 'zod-validation-error';

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

import Heading from "@/components/Heading";
import Icons from "@/components/Icons";
import KeyAlert from "@/components/KeyAlert";
import ChainBadge from "@/components/ChainBadge";
import AccountsLoader from "@/components/AccountsLoader";
import FileUpload from "@/components/FileUpload";

import { accountsSelector, invalidateAccounts } from "@/app/store/accounts";
import { createAccount } from "@/lib/keyring";
import { abbreviateAddress, fromUint8Array } from "@/lib/utils";
import { Parameters } from "@/lib/types";
import { exportAccount } from "@/lib/import-export";
import guard from "@/lib/guard";

import {exportedKey, ExportedKey} from '@/lib/schemas';

export default function ImportAccount({onImportComplete}: {onImportComplete: () => void}) {
  const { toast } = useToast();
  const [importShares, setImportShares] = useState<ExportedKey>(null);

  const readFile = async (file: File) => {
    await guard(async () => {
      const buffer = await file.arrayBuffer();
      const contents = fromUint8Array(new Uint8Array(buffer));
      const keystore = JSON.parse(contents);
      try {
        const importShares: ExportedKey = exportedKey.parse(keystore);
        setImportShares(importShares);
      } catch(error) {
        const validationError = fromZodError(error);
        throw validationError;
      }
    }, toast);
  };

  const importAccount = async () => {
    await guard(async () => {
      for(const [_, privateKey] of Object.entries(importShares.privateKey)) {
        await createAccount(privateKey, "Imported account");
      }
      onImportComplete();
    }, toast);
  };

  const action = importShares === null
    ? (
      <Button disabled>Continue</Button>
    )
    : (
      <AlertDialogAction onClick={importAccount}>
        Continue
      </AlertDialogAction>
    );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Icons.upload className="h-4 w-4 mr-2" />
          Import
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Import account</AlertDialogTitle>
          <AlertDialogDescription>
            Choose the file containing the key share(s).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FileUpload onSelect={readFile} />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {action}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
