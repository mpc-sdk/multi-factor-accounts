import React, { useState } from "react";
import { useParams, useSearchParams } from 'react-router-dom';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import Heading from "@/components/Heading";
import Icons from "@/components/Icons";
import KeyBadge from "@/components/KeyBadge";
import MeetingPoint from "@/components/MeetingPoint";
import SessionRunner from "@/components/SessionRunner";

import { SessionState, OwnerType, SessionType } from "@/app/model";

import NotFound from "@/pages/NotFound";

function JoinKeyContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Heading>Join Key</Heading>
      {children}
    </>
  );
}

export default function JoinKey() {
  const [publicKeys, setPublicKeys] = useState<string[]>(null);
  const { meetingId, userId } = useParams();
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');
  const parties = searchParams.get('parties');
  const threshold = searchParams.get('threshold');

  // Check we have all the required parameters
  const paramsValid = meetingId && userId && name && parties && threshold
    && !isNaN(parseInt(parties)) && !isNaN(parseInt(threshold));

  if (!paramsValid) {
    return <NotFound />;
  }

  const session: SessionState = {
    ownerType: OwnerType.participant,
    sessionType: SessionType.keygen,
    meetingId,
    userId,
  };

  const startKeygen = async () => {
    console.log("Start key generation (participant)..");
  };

  // Meeting is prepared so we can execute keygen
  if (publicKeys !== null) {
    return (
      <JoinKeyContent>
        <KeyBadge name={name} threshold={threshold} parties={parties} />
        <SessionRunner
          loaderText="Generating key share..."
          executor={startKeygen} />
      </JoinKeyContent>
    );
  }

  return (
    <JoinKeyContent>
      <KeyBadge name={name} threshold={threshold} parties={parties} />
      <div className="flex flex-col space-y-6 mt-12">
        <Alert>
          <Icons.key className="h-4 w-4" />
          <AlertTitle>Join key</AlertTitle>
          <AlertDescription>
            Joining the key, when all participants are here we will proceed to
            key generation
          </AlertDescription>
        </Alert>
        <MeetingPoint
          session={session}
          onPublicKeys={(keys) => setPublicKeys(keys)}
        />
      </div>
    </JoinKeyContent>
  );
}
