import React from "react";

import { Button } from "@/components/ui/button";

import Heading from "@/components/Heading";
import Paragraph from "@/components/Paragraph";
import Icons from "@/components/Icons";
import ServerUrlForm from "@/forms/ServerUrl";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import serverUrl from "@/lib/server-url";

export default function Settings() {
  const defaultServerUrl = serverUrl;
  return (
    <>
      <Heading>Settings</Heading>
      <div className="flex flex-col mt-12 space-y-6">
        <Alert>
          <Icons.server className="h-4 w-4" />
          <AlertTitle>Relay Server</AlertTitle>
          <AlertDescription>
            Change the end-to-end encrypted relay server URL if you want to
            self-host the backend server or use an alternative service provider.
          </AlertDescription>
        </Alert>
        <ServerUrlForm
          initialValue={defaultServerUrl}
          onNext={(url) => {
            console.log("url", url);
          }}
          submit={<Button type="submit">Save</Button>}
        />
      </div>
    </>
  );
}
