import React from "react";
import { Badge } from "@/components/ui/badge";
import { abbreviateAddress } from "@/lib/utils";

export default function PublicKeyBadge({ publicKey }: { publicKey: string }) {
  return <Badge variant="outline">{abbreviateAddress(publicKey)}</Badge>;
}
