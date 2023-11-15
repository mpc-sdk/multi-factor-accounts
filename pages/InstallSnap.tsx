import React from "react";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import Heading from "@/components/Heading";
import Paragraph from "@/components/Paragraph";

import guard from "@/lib/guard";
import { connectSnap } from "@/lib/snap";

export default function InstallSnap({ onConnect }: { onConnect: () => void }) {
  const { toast } = useToast();

  const connect = async () => {
    await guard(async () => {
      await connectSnap();
      onConnect();
    }, toast);
  };

  return (
    <>
      <Heading>Snap not installed</Heading>
      <Paragraph>Connect to MetaMask to install the snap.</Paragraph>
      <div className="flex justify-end">
        <Button onClick={connect}>Connect to MetaMask</Button>
      </div>
    </>
  );
}
