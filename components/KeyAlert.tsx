import React from "react";
import Icons from "@/components/Icons";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function KeyAlert({
  title,
  description,
  icon,
}: {
  title: string;
  description: React.ReactNode;
  icon?: React.ReactNode;
}) {
  const alertIcon = icon ?? <Icons.key className="h-4 w-4" />;

  return (
    <Alert>
      {alertIcon}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
