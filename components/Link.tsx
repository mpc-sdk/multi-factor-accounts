export default function Link( {href, children}: {href: string} ) {
  return <a
    href={href}
    className="font-medium text-primary underline underline-offset-4">
    {children}
  </a>;
}
