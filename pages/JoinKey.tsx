import React, { useState, useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { useToast } from "@/components/ui/use-toast";

import { KeypairContext } from "@/app/providers/keypair";

import Heading from "@/components/Heading";
import KeyAlert from "@/components/KeyAlert";
import CreateKeyAlert from "@/components/CreateKeyAlert";
import KeyBadge from "@/components/KeyBadge";
import PublicKeyBadge from "@/components/PublicKeyBadge";
import MeetingPoint from "@/components/MeetingPoint";
import SessionRunner from "@/components/SessionRunner";
import SaveKeyShare from "@/components/SaveKeyShare";

import {
  PublicKeys,
  AssociatedData,
  SessionState,
  OwnerType,
  SessionType,
} from "@/app/model";

import NotFound from "@/pages/NotFound";

import { PrivateKey } from "@/lib/types";
import guard from "@/lib/guard";
import { keygen, WebassemblyWorker } from "@/lib/client";
import { convertRawKey } from "@/lib/utils";

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
  const [keyShare, setKeyShare] = useState<PrivateKey>(null);
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
          // Threshold is human-friendly but for the protocol
          // we need to cross the threshold hence the -1
          threshold: (keygenData.get("threshold") as number) - 1,
        },
        null, // Participants MUST be null when joining
      );
      console.log("key share", keyShare);

      setKeyShare(convertRawKey(keyShare));

      //await createAccount(convertRawKey(keyShare), name);
    }, toast);
  };

  const Badges = () => (
    <div className="flex justify-between items-center mt-2">
      <KeyBadge
        name={name}
        parties={keygenData && (keygenData.get("parties") as number)}
        threshold={keygenData && (keygenData.get("threshold") as number)}
      />
      <PublicKeyBadge publicKey={publicKey} />
    </div>
  );

  if (keyShare !== null) {
    return (
      <JoinKeyContent>
        <Badges />
        <SaveKeyShare keyShare={keyShare} name={name} />
      </JoinKeyContent>
    );
  }

  // Meeting is prepared so we can execute keygen
  if (publicKeys !== null) {
    return (
      <JoinKeyContent>
        <Badges />
        <SessionRunner
          loaderText="Creating key share..."
          message={<CreateKeyAlert />}
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
