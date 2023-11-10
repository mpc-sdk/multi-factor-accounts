import React from "react";
import { Badge } from "@/components/ui/badge";

export default function KeyBadge({
  name,
  threshold,
  parties,
}: {
  name: string;
  threshold?: number | string;
  parties?: number | string;
}) {
  return (
    <div className="flex space-x-2">
      <Badge>{name}</Badge>
      {threshold && parties && (
        <Badge variant="secondary">
          {threshold} of {parties}
        </Badge>
      )}
    </div>
  );
}
