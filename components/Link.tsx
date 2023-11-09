import React from "react";

export default function Link({
  href,
  className,
  children,
  target,
}: {
  href: string;
  className?: string;
  target?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={target}
      className={
        className ?? "font-medium text-primary underline underline-offset-4"
      }
    >
      {children}
    </a>
  );
}
