import React, { useState, useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { useToast } from "@/components/ui/use-toast";

import { KeypairContext } from '@/app/providers/keypair';

import Heading from "@/components/Heading";
import KeyAlert from "@/components/KeyAlert";
import KeyBadge from "@/components/KeyBadge";
import PublicKeyBadge from "@/components/PublicKeyBadge";
import MeetingPoint from "@/components/MeetingPoint";
import SessionRunner from "@/components/SessionRunner";

import {
  PublicKeys,
  AssociatedData,
  SessionState,
  OwnerType,
  SessionType,
} from "@/app/model";

import NotFound from "@/pages/NotFound";

import guard from '@/lib/guard';
import { keygen, WebassemblyWorker } from '@/lib/client';

function JoinKeyContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Heading>Join Key</Heading>
      {children}
    </>
  );
}

export default function JoinKey() {
  const keypair = useContext(KeypairContext);

  const { toast } = useToast();
  const [publicKeys, setPublicKeys] = useState<PublicKeys>(null);
  const [keygenData, setKeygenData] = useState<AssociatedData>(null);
  const { meetingId, userId } = useParams();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");

  if (keypair === null) {
    return null;
  }
  const { publicKey } = keypair;

  if (!meetingId || !userId || !name) {
    return <NotFound />;
  }

  const session: SessionState = {
    ownerType: OwnerType.participant,
    sessionType: SessionType.keygen,
    meetingId,
    userId,
  };

  const startKeygen = async (worker: WebassemblyWorker, serverUrl: string) => {
    console.log("Start key generation (participant)..");
    await guard(async () => {
      const keyShare = await keygen(
        worker,
        serverUrl,
        {
          parties: keygenData.get("parties") as number,
          threshold: keygenData.get("threshold") as number,
        },
        publicKeys,
      );
      console.log("key share", keyShare);
    }, toast);
  };

  const Badges = () => (
    <div className="flex justify-between items-center mt-2">
      <KeyBadge
        name={name}
        parties={keygenData && keygenData.get("parties") as number}
        threshold={keygenData && keygenData.get("threshold") as number}
      />
      <PublicKeyBadge publicKey={publicKey} />
    </div>
  );

  // Meeting is prepared so we can execute keygen
  if (publicKeys !== null) {
    return (
      <JoinKeyContent>
        <Badges />
        <SessionRunner
          loaderText="Creating key share..."
          message={
            <KeyAlert
              title="Generating key share"
              description="Crunching the numbers to compute your key share securely"
            />
          }
          executor={startKeygen}
        />
      </JoinKeyContent>
    );
  }

  return (
    <JoinKeyContent>
      <Badges />
      <div className="flex flex-col space-y-6 mt-12">
        <KeyAlert
          title="Join key"
          description="Joining the key, when all participants are here we will proceed to key generation"
        />
        <MeetingPoint
          session={session}
          onMeetingPointReady={(keys, data) => {
            setPublicKeys(keys);
            setKeygenData(data as AssociatedData);
          }}
        />
      </div>
    </JoinKeyContent>
  );
}
