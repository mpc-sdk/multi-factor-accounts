import React from "react";

export const linkClasses = "cursor-pointer font-medium text-primary underline underline-offset-4";

export default function Link({
  href,
  className,
  children,
  target,
  onClick,
}: {
  href?: string
  className?: string
  target?: string
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}) {
  return (
    <a
      href={href}
      target={target}
      onClick={onClick}
      className={
        className ?? linkClasses
      }
    >
      {children}
    </a>
  );
}
