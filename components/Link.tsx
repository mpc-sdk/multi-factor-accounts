import React from "react";

export default function Link({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="font-medium text-primary underline underline-offset-4"
    >
      {children}
    </a>
  );
}
