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

function JoinSignContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Heading>Join Transaction</Heading>
      {children}
    </>
  );
}

export default function JoinSign() {
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

  const startSigning = async (worker: WebassemblyWorker, serverUrl: string) => {
    console.log("Start signing (participant)..");

    /*
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

      setKeyShare(convertRawKey(keyShare));
    }, toast);
    */
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
      <JoinSignContent>
        <Badges />
        <SaveKeyShare keyShare={keyShare} accountName={name} />
      </JoinSignContent>
    );
  }

  // Meeting is prepared so we can execute keygen
  if (publicKeys !== null) {
    return (
      <JoinSignContent>
        <Badges />
        <SessionRunner
          loaderText="Signing the transaction..."
          message={<CreateKeyAlert />}
          executor={startSigning}
        />
      </JoinSignContent>
    );
  }

  return (
    <JoinSignContent>
      <Badges />
      <div className="flex flex-col space-y-6 mt-12">
        <KeyAlert
          title="Join transaction"
          description="Joining a transaction, when all participants are here we will proceed to sign the transaction"
        />
        <MeetingPoint
          session={session}
          onMeetingPointReady={(keys, data) => {
            setPublicKeys(keys);
            setKeygenData(data as AssociatedData);
          }}
        />
      </div>
    </JoinSignContent>
  );
}
