import React from "react";
import type { KeyringAccount } from "@metamask/keyring-api";
import { Parameters } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export default function SharesBadge({ account }: { account: KeyringAccount }) {
  const { shares, parameters } = account.options as {
    shares: string[];
    parameters: Parameters;
  };

  const numShares = shares.length;

  return (
    <Badge variant="outline" className="mt-4">
      {numShares} share{numShares > 1 ? "s" : ""} in a{" "}
      {parameters.threshold + 1} of {parameters.parties}
    </Badge>
  );
}
