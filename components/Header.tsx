import {Link} from '@/components/Link';
import Logo  from '@/components/Logo';

export default function Header() {
  return (
    <header
      className="fixed z-20 w-full border-b bg-background">
      <div
        className="container mx-auto flex items-center justify-between px-4">
        <Link href="#/">
          <Logo />
        </Link>
      </div>
    </header>
  )
}
