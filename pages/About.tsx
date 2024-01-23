import React from "react";
import Heading from "@/components/Heading";
import Paragraph from "@/components/Paragraph";
//import Link from "@/components/Link";

export default function About() {
  return (
    <div>
      <Heading>About</Heading>

      <Paragraph>
        Multi-factor accounts let us enhance the security of specific accounts.
        They allow us to split the private key across several devices so that
        you need both your MetaMask password and access to the key shares on
        several devices in order to sign a transaction.
      </Paragraph>

      <Paragraph>
        Key generation securely distributes the key shares without ever
        revealing the entire key so multi-factor accounts are a good choice when
        transactions need approval from several different people, for example, a
        business may want approval from several executives before a transaction
        is approved.
      </Paragraph>

      <Paragraph>
        We use a threshold signature scheme that distributes key shares to a
        number of parties and transactions can be signed when the *threshold* is
        reached. So it is very important that there are always *threshold*
        number of key shares available otherwise access to the account is lost.
      </Paragraph>

      <Paragraph>
        To prevent losing access to the account you can create redundant key
        shares which can be exported. Exported key shares should be stored in a
        secure location such as an encrypted disc or an encrypted password
        manager.
      </Paragraph>

      <Paragraph>
        We strongly recommend exporting backup and/or redundant key shares to
        secure, encrypted storage to prevent losing access to your account.
      </Paragraph>
    </div>
  );
}
