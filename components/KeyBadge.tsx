import React from "react";
import { Badge } from "@/components/ui/badge";

export default function KeyBadge({
  name,
  threshold,
  parties,
}: {
  name: string
  threshold?: number | string
  parties?: number | string
}) {
  return <div className="flex space-x-2 mt-2">
    <Badge className="mt-2">{name}</Badge>
    {threshold && parties && <Badge
      variant="secondary"
      className="mt-2">{threshold} of {parties}</Badge>}
  </div>
}
