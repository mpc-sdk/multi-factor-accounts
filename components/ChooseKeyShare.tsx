import React, {useState} from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

function AlertContent({shares, onChange}: { shares: string[], onChange: (shareId: string) => void }) {
  return (
    <AlertDialogHeader>
      <AlertDialogTitle>Choose Key Share</AlertDialogTitle>
      <AlertDialogDescription>
        Choose the key share to use to sign this transaction. If you are signing with multiple key shares you <strong>must use a unique key share</strong>.
      </AlertDialogDescription>
      <RadioGroup
        className="pt-4"
        defaultValue={shares[0]}
        onValueChange={onChange}>
        {shares.map((shareId: string, index: number) => {
          return <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem value={shareId} id={shareId} />
            <Label htmlFor={shareId}>Share {shareId}</Label>
          </div>;
        })}
      </RadioGroup>
    </AlertDialogHeader>
  );
}

export default function ChooseKeyShare({
  button,
  shares,
  onConfirm,
}: {
  button: React.ReactNode;
  shares: string[];
  onConfirm: (shareId: string) => void;
}) {
  const [shareId, setShareId] = useState(shares[0]);
  const chooseKeyShare = async () => {
    onConfirm(shareId);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {button}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertContent shares={shares} onChange={(shareId) => setShareId(shareId)} />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={chooseKeyShare}>
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
