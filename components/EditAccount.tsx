import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import Icons from "@/components/Icons";

import KeyShareNameForm from "@/forms/KeyShareName";

export default function EditAccount({
  initialValue,
  onUpdate,
}: {
  initialValue: string;
  onUpdate: (value: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const onSubmit = async (value: string) => {
    setUpdating(true);
    await onUpdate(value);
    setUpdating(false);
    setOpen(false);
  };

  const onOpenChange = (value: boolean) => setOpen(value);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Icons.pencil className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit account</AlertDialogTitle>
          <AlertDialogDescription>
            Change the name of this account.
          </AlertDialogDescription>
          <KeyShareNameForm
            initialValue={initialValue}
            submit={
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button type="submit" disabled={updating}>
                  {updating && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update
                </Button>
              </AlertDialogFooter>
            }
            onNext={onSubmit}
          />
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
