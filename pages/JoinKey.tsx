import React from "react";
import { useParams, useSearchParams } from 'react-router-dom';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import Heading from "@/components/Heading";
import Icons from "@/components/Icons";
import KeyBadge from "@/components/KeyBadge";
import MeetingPoint from "@/components/MeetingPoint";

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
  const { meetingId, userId } = useParams();
  const [searchParams, _] = useSearchParams();
  const name = searchParams.get('name');
  const parties = searchParams.get('parties');
  const threshold = searchParams.get('threshold');

  if (!meetingId || !userId || !name || !parties || !threshold) {
    return <NotFound />;
  }

  const session: SessionState = {
    ownerType: OwnerType.participant,
    sessionType: SessionType.keygen,
    meetingId,
    userId,
  };

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
        <MeetingPoint session={session} />
      </div>
    </JoinKeyContent>
  );
}
