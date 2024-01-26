import React from "react";
import { useNavigate } from "react-router-dom";
import KeyAlert from "@/components/KeyAlert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { DownloadKeyShare } from "@/components/ExportAccount";
import { createAccount } from "@/lib/keyring";
import { PrivateKey } from "@/lib/types";
import guard from "@/lib/guard";

export default function SaveKeyShare({
  accountName,
  keyShare,
}: {
  accountName: string;
  keyShare: PrivateKey;
}) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const saveKeyShare = async () => {
    await guard(async () => {
      await createAccount(keyShare, accountName);
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
        description={
          <>
            <span>
              Your key share is ready, now you just need to save it in MetaMask
              or download and save it to safe encrypted storage such as a
              password manager or encrypted disc.
            </span>
            <p className="mt-4 font-semibold">
              Remember that if you have more than one key share in this account
              you need to save each share in each browser tab!
            </p>
          </>
        }
      />
      <div className="flex justify-end space-x-4">
        <DownloadKeyShare
          keyShare={keyShare}
          buttonText="Download"
          accountName={accountName}
        />
        <Button onClick={saveKeyShare}>Save to MetaMask</Button>
      </div>
    </div>
  );
}
