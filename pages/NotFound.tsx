import React from 'react';
import Heading from '@/components/Heading'
import Paragraph from '@/components/Paragraph'
import Link from '@/components/Link'

export default function NotFound() {
  return (
    <>
    <Heading>Page not found</Heading>
    <Paragraph>We could not find the page you are looking for please <Link href="/#">start from the home page</Link>.</Paragraph>
    </>
  );
}
