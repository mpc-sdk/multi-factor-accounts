import Heading from '@/components/Heading';
import Paragraph from '@/components/Paragraph';
import Link from '@/components/Link';

export default function About() {
  return (
    <div>
      <Heading>
        About
      </Heading>

      <Paragraph>
        Threshold signature schemes (TSS) allow multiple collaborating participants to sign a message or transaction; it is a cost-effective way to perform collaborative transactions without involving a smart contract.
      </Paragraph>

      <Paragraph>
        The private key is shared between the participants using a technique called <Link href="https://en.wikipedia.org/wiki/Secure_multi-party_computation">multi-party computation</Link> (MPC) which ensures that the entire private key is never exposed to any participant; the process for generating key shares is called <Link href="https://en.wikipedia.org/wiki/Distributed_key_generation">distributed key generation</Link> (DKG).
      </Paragraph>

      <Paragraph>
        Before a signature can be generated all participants must generate key shares using DKG and store their key shares securely; the number of participants and threshold for signature generation must be decided in advance.
      </Paragraph>

      <Paragraph>
        Unlike other techniques such as <Link href="https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing">Shamirs Secret Sharing</Link> (SSS) the entire private key is never revealed to any single participant and is therefore more secure as it does not have the <em>trusted dealer</em> problem.
      </Paragraph>

      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Use Case
      </h2>

      <Paragraph>
        One use case for TSS is to support multi-factor authentication for a
          single user. For example; a single user could generate key shares for two participants and with threshold of two (called a 2 of 2) and store each key share on separate devices. When they want to sign a transaction they would need to interactively collaborate using the different devices. This means that if a single device is stolen or lost then the ability to sign transactions is not compromised; however if both devices were lost and both key shares were acquired the private key is lost.
      </Paragraph>

      <Paragraph>
        This is a simple scenario that does not cater for backup key shares; in reality even with two devices it would be better to generate a 2 of 4 and store two of the key shares securely on multiple redundant storage devices in case the primary key shares were lost or stolen.

        If you have a laptop, phone and tablet a 2 of 5 could be appropriate. Store a primary key share on each device and backup the remaining two redundant key shares securely. In this scenario (unlike the 2 of 2) the loss of a single device does not deny you the ability to sign transactions.
      </Paragraph>

      <Paragraph>
        Another use case is for organizations that would like multiple stakeholders to approve transactions. By using a threshold signature scheme and assigning key shares to multiple stakeholders transactions can only be approved when a threshold of stakeholders agree on the transaction.
      </Paragraph>

      <Paragraph>
        For organizations, signing messages using a threshold signature scheme could also be used as a simple voting mechanism.
      </Paragraph>

      <Paragraph>
        These scenarios using multiple users to approve transactions or messages can be achieved using smart contracts and where logic is required a smart contract will be the appropriate choice however if there is no logic then using a threshold signature scheme removes the upfront burden of programming a smart contract and will be cheaper as it does not incur the gas fees of smart contract calls.
      </Paragraph>

      <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
        Notes
      </h3>

      <Paragraph>
        We use the <Link href="https://eprint.iacr.org/2020/540.pdf">GG20 protocol (pdf)</Link> exposed by the <Link href="https://github.com/ZenGo-X/multi-party-ecdsa">multi-party-ecdsa</Link> library compiled to Webassembly.
      </Paragraph>

      <Paragraph>
        Communication between participants uses a websocket transport using an <Link href="https://docs.rs/mpc-websocket/latest/mpc_websocket/">open-source library</Link> we created. The websocket server code is licensed as MIT or Apache-2.0. This <Link href="https://github.com/LavaMoat/tss-snap/tree/main/snap/dapp">snap</Link>, <Link href="https://github.com/LavaMoat/tss-snap/tree/main/packages/client">javascript client</Link> and <Link href="https://github.com/LavaMoat/tss-snap/tree/main/packages/wasm">webassembly bindings</Link> are licensed as GPLv3.
      </Paragraph>
    </div>
  )
}
