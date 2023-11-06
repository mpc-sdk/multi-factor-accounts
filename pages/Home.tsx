import Heading from '@/components/Heading';
import Paragraph from '@/components/Paragraph';
import Link from '@/components/Link';


/*
  <SnapConnect redirect="/keys" />
*/

export default function Home() {
  return (
    <div>
      <Heading>Connect</Heading>
      <Paragraph>
        Read more&nbsp;
        <Link href="#/about">
        about threshold signatures
        </Link>
        &nbsp;or get the&nbsp;
        <Link href="https://github.com/mpc-sdk/tss-snap">
        source code
        </Link>
        &nbsp;on github.
      </Paragraph>
    </div>
  )
}
