import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import KeyAlert from "@/components/KeyAlert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { createAccount } from "@/lib/keyring";
import { invalidateAccounts } from "@/app/store/accounts";
import { PrivateKey } from "@/lib/types";
import guard from "@/lib/guard";

export default function SaveKeyShare({
  name,
  keyShare,
}: {
  name: string;
  keyShare: PrivateKey;
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const downloadKeyShare = async () => {
    await guard(async () => {
      //await createAccount(keyShare, name);
    }, toast);
  };

  const saveKeyShare = async () => {
    await guard(async () => {
      await createAccount(keyShare, name);
      await dispatch(invalidateAccounts());
      toast({
        title: "Saved",
        description: "Account key share saved to MetaMask",
      });
      navigate("/");
    }, toast);
  };

  return (
    <div className="flex flex-col space-y-6 mt-12">
      <KeyAlert
        title="Key share ready!"
        description="Your key share is ready, now you just need to save it in MetaMask or download and save it to safe encrypted storage such as a password maanager or encrypted disc."
      />
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={downloadKeyShare}>
          Download
        </Button>
        <Button onClick={saveKeyShare}>Save to MetaMask</Button>
      </div>
    </div>
  );
}
