import React from "react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import Icons from "@/components/Icons";

import { abbreviateAddress, copyWithToast } from "@/lib/utils";

export default function AddressBadge({address, className}: {address: string, className?: string}) {
  const { toast } = useToast();
  const copyAddress = async () => {
    await copyWithToast(address, toast);
  };

  return <Badge onClick={copyAddress} className={className ?? 'cursor-pointer'} variant="secondary">
    <Icons.copy className="h-4 w-4 mr-2" />
    {abbreviateAddress(address)}
  </Badge>;
}
