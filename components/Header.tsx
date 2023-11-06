import React from 'react';
import Link from '@/components/Link';
import Logo  from '@/components/Logo';

export default function Header() {
  return (
    <header
      className="fixed z-20 w-full border-b bg-background py-4">
      <div
        className="container mx-auto flex justify-between px-8">
        <div className="flex items-center">
          <Link href="#/">
            <Logo />
          </Link>
          <h3 className="ml-4 font-semibold tracking-tight">
            Threshold signatures
          </h3>
        </div>
      </div>
    </header>
  )
}
