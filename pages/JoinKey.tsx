import React, { useState } from "react";
import { useParams, useSearchParams } from 'react-router-dom';

import Heading from "@/components/Heading";
import Icons from "@/components/Icons";
import KeyAlert from "@/components/KeyAlert";
import KeyBadge from "@/components/KeyBadge";
import MeetingPoint from "@/components/MeetingPoint";
import SessionRunner from "@/components/SessionRunner";

import { KeygenAssociatedData, SessionState, OwnerType, SessionType } from "@/app/model";

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
  const [keygenData, setKeygenData] = useState<KeygenAssociatedData>(null);
  const { meetingId, userId } = useParams();
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');

  if (!meetingId || !userId || !name) {
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
        <KeyBadge
          name={keygenData.get('name')}
          threshold={keygenData.get('threshold')}
          parties={keygenData.get('parties')} />
        <SessionRunner
          loaderText="Creating key share..."
          message={
            <KeyAlert
              title="Generating key share"
              description="Crunching the numbers to compute your key share securely"
              />
          }
          executor={startKeygen} />
      </JoinKeyContent>
    );
  }

  return (
    <JoinKeyContent>
      <KeyBadge name={name} />
      <div className="flex flex-col space-y-6 mt-12">
        <KeyAlert
          title="Join key"
          description="Joining the key, when all participants are here we will proceed to key generation"
          />
        <MeetingPoint
          session={session}
          onMeetingPointReady={(keys, data) => {
            setPublicKeys(keys);
            setKeygenData(data as KeygenAssociatedData);
          }}
        />
      </div>
    </JoinKeyContent>
  );
}
