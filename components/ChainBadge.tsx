import React, { useContext } from "react";
import { Badge } from "@/components/ui/badge";

import { ChainContext } from "@/app/providers/chain";
import { getChainName } from "@/lib/utils";

export default function ChainBadge({ className }: { className: string }) {
  const chain = useContext(ChainContext);
  if (!chain) {
    return null;
  }

  const chainName = getChainName(chain);
  return <Badge className={className}>{chainName}</Badge>;
}
