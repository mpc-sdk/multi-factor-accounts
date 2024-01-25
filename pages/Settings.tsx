import React, { useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import Heading from "@/components/Heading";
import Icons from "@/components/Icons";
import ServerUrlForm from "@/forms/ServerUrl";
import { useServerUrl } from "@/app/hooks";
import { fetchServerPublicKey } from "@/lib/client";
import guard from "@/lib/guard";

export default function Settings() {
  const { toast } = useToast();
  const [serverUrl, setServerUrl] = useServerUrl();
  const [serverInfo, setServerInfo] = useState(null);

  const submit =
    serverInfo === null ? (
      <Button type="submit">Verify</Button>
    ) : (
      <Button type="submit">Save</Button>
    );

  const onReset = () => {
    setServerInfo(null);
  };

  const back = (
    <Button type="reset" variant="outline" onClick={onReset}>
      Reset
    </Button>
  );

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
          initialValue={serverUrl}
          serverInfo={serverInfo}
          onNext={async (url) => {
            await guard(async () => {
              if (serverInfo == null) {
                const remoteServerInfo = await fetchServerPublicKey(url, true);
                setServerInfo(remoteServerInfo);
              } else {
                setServerInfo(null);
                setServerUrl(url);
                toast({
                  title: "Saved",
                  description: "Relay server URL saved",
                });
              }
            }, toast);
          }}
          back={back}
          submit={submit}
        />
      </div>
    </>
  );
}
