import React from "react";
import Icons from "@/components/Icons";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function KeyAlert({
  title,
  description,
}: {
  title: string
  description: React.ReactNode
}) {
  return <Alert>
    <Icons.key className="h-4 w-4" />
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription>
      {description}
    </AlertDescription>
  </Alert>;
}
