import React from "react";
import { useNavigate } from "react-router-dom";

import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import Link from "@/components/Link";
import Paragraph from "@/components/Paragraph";

import snapId from "@/lib/snap-id";

type RedirectHandler = () => void;

type SnapConnectProps = {
  redirect: string | RedirectHandler;
};

export default function SnapConnect(props: SnapConnectProps) {
  const { redirect } = props;
  const { toast } = useToast();
  const navigate = useNavigate();

  async function onConnect() {
    console.log("Connect to snap", snapId);

    try {
      await ethereum.request({
        method: "wallet_requestSnaps",
        params: { [snapId]: {} },
      });

      if (typeof redirect === "string") {
        navigate(redirect);
      } else {
        redirect();
      }
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Error",
        description: e.message || e.toString(),
      });
    }
  }

  return (
    <>
      <div>
        <Paragraph>
          To begin you should have installed{" "}
          <Link href="https://metamask.io/flask/">MetaMask Flask</Link>{" "}
          (&gt;=11.4.0) and then you can connect.
        </Paragraph>
        <Button onClick={onConnect}>Connect to MetaMask</Button>
      </div>
    </>
  );
}
