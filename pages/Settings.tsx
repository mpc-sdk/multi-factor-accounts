import React from "react";
import Heading from "@/components/Heading";
import Paragraph from "@/components/Paragraph";
import Icons from "@/components/Icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
//import Link from "@/components/Link";

export default function Settings() {
  return (
    <div>
      <Heading>Settings</Heading>
      <Alert className="mt-12">
        <Icons.server className="h-4 w-4" />
        <AlertTitle>Relay Server</AlertTitle>
        <AlertDescription>
          Change the end-to-end encrypted relay server URL if you want to
          self-host the backend server or use an alternative service provider.
        </AlertDescription>
      </Alert>
    </div>
  );
}
