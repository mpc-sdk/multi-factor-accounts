import React from "react";
//import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import Link from "@/components/Link";
import Paragraph from "@/components/Paragraph";

import snapId from "@/lib/snap-id";
//import { setSnackbar } from "./store/snackbars";

type RedirectHandler = () => void;

type SnapConnectProps = {
  redirect: string | RedirectHandler;
};

export default function SnapConnect(props: SnapConnectProps) {
  const { redirect } = props;
  //const dispatch = useDispatch();
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
      throw e;
      /*
      dispatch(
        setSnackbar({
          message: `Could not connect: ${e.message || ""}`,
          severity: "error",
        })
      );

      */
    }
  }

  return (
    <>
      <div>
        <Paragraph>
          To begin you should have installed{" "}
          <Link href="https://metamask.io/flask/">MetaMask Flask</Link>{" "}
          (&gt;=10.25) and then you can connect.
        </Paragraph>
        <Button onClick={onConnect}>Connect to MetaMask</Button>
      </div>
    </>
  );
}
