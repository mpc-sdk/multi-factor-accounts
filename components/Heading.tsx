import React from "react";

export function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl text-ellipsis overflow-hidden whitespace-nowrap">
      {children}
    </h1>
  );
}

export default function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-ellipsis overflow-hidden whitespace-nowrap">
      {children}
    </h1>
  );
}
