import React from "react";
import Heading from "@/components/Heading";
import Paragraph from "@/components/Paragraph";
import Link from "@/components/Link";

export default function NoMetaMask() {
  const reload = () => document.location.reload();
  return (
    <>
      <Heading>MetaMask not installed</Heading>
      <Paragraph>
        To begin you should install&nbsp;
        <Link href="https://metamask.io/flask/" target="_blank">
          MetaMask Flask
        </Link>
        &nbsp; (&gt;=11.4.0) and then you can{" "}
        <Link onClick={reload}>refresh this page</Link>.
      </Paragraph>
    </>
  );
}
