import React from "react";

export default function Link({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className ?? "font-medium text-primary underline underline-offset-4"}
    >
      {children}
    </a>
  );
}
