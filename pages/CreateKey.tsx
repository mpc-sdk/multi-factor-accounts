import React, { useState, useContext } from "react";

import { KeypairContext } from '@/app/providers/keypair';

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import Heading from "@/components/Heading";
import KeyAlert from "@/components/KeyAlert";
import KeyBadge from "@/components/KeyBadge";
import PublicKeyBadge from "@/components/PublicKeyBadge";
import MeetingPoint from "@/components/MeetingPoint";
import SessionRunner from "@/components/SessionRunner";

import KeyShareAudienceForm from "@/forms/KeyShareAudience";
import KeyShareNameForm from "@/forms/KeyShareName";
import KeyShareNumberForm from "@/forms/KeyShareNumber";

import {
  PublicKeys,
  CreateKeyState,
  KeyShareAudience,
  OwnerType,
  SessionType,
  SessionState,
} from "@/app/model";

import guard from '@/lib/guard';
import { keygen, WebassemblyWorker } from '@/lib/client';

function CreateKeyContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Heading>Create Key</Heading>
      {children}
    </>
  );
}

export default function CreateKey() {
  const keypair = useContext(KeypairContext);
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [createKeyState, setCreateKeyState] = useState<CreateKeyState>({
    ownerType: OwnerType.initiator,
    sessionType: SessionType.keygen,
  });
  const [publicKeys, setPublicKeys] = useState<PublicKeys>(null);

  if (keypair === null) {
    return null;
  }
  const { publicKey } = keypair;

  const onKeyAudience = (audience: KeyShareAudience) => {
    setCreateKeyState({ ...createKeyState, audience });
    setStep(step + 1);
  };

  const onKeyName = (name: string) => {
    const newState = { ...createKeyState, name };
    setCreateKeyState(newState);
    setStep(step + 1);
  };

  const onKeyParties = (parties: number) => {
    const newState = { ...createKeyState, parties };
    setCreateKeyState(newState);
    setStep(step + 1);
  };

  const onKeyThreshold = (threshold: number) => {
    const newState = { ...createKeyState, threshold };
    setCreateKeyState(newState);
    setStep(step + 1);
  };

  const BackButton = () => (
    // NOTE: the type="button" is required so form submission on
    // NOTE: enter key works as expected.
    <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
      Back
    </Button>
  );

  const startKeygen = async (worker: WebassemblyWorker, serverUrl: string) => {
    console.log("Start key generation (initiator)..");
    await guard(async () => {
      const keyShare = await keygen(
        worker,
        serverUrl,
        {
          parties: createKeyState.parties,
          threshold: createKeyState.threshold,
        },
        publicKeys,
      );
      console.log("key share", keyShare);
    }, toast);
  };

  const Badges = () => (
    <div className="flex justify-between items-center mt-2">
      <KeyBadge
        name={createKeyState.name}
        threshold={createKeyState.threshold}
        parties={createKeyState.parties}
      />
      <PublicKeyBadge publicKey={publicKey} />
    </div>
  );

  // Meeting is prepared so we can execute keygen
  if (publicKeys !== null) {
    return (
      <CreateKeyContent>
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
      </CreateKeyContent>
    );
  }

  if (step == 0) {
    return (
      <CreateKeyContent>
        <KeyShareAudienceForm onNext={onKeyAudience} />
      </CreateKeyContent>
    );
  } else if (step == 1) {
    return (
      <CreateKeyContent>
        <KeyShareNameForm onNext={onKeyName} back={<BackButton />} />
      </CreateKeyContent>
    );
  } else if (step == 2) {
    return (
      <CreateKeyContent>
        <Badges />
        <KeyShareNumberForm
          back={<BackButton />}
          onNext={onKeyParties}
          defaultValue={createKeyState.parties}
          label="Parties"
          message={
            <KeyAlert
              title="How many key shares?"
              description="Choose the number of participants that will share this key."
            />
          }
        />
      </CreateKeyContent>
    );
  } else if (step == 3) {
    return (
      <CreateKeyContent>
        <Badges />
        <KeyShareNumberForm
          back={<BackButton />}
          onNext={onKeyThreshold}
          label="Threshold"
          defaultValue={createKeyState.threshold || createKeyState.parties}
          max={createKeyState.parties}
          message={
            <KeyAlert
              title="Set the threshold"
              description="Choose how many participants are required to sign a message or transaction."
            />
          }
        />
      </CreateKeyContent>
    );
  } else if (step == 4) {
    const { audience, parties, threshold } = createKeyState;
    const audienceLabel =
      audience == KeyShareAudience.self
        ? "just for me"
        : "shared with other people";

    const message = `Create a new key ${audienceLabel} split into ${parties} shares and require ${threshold} participants to sign.`;

    return (
      <CreateKeyContent>
        <Badges />
        <div className="flex flex-col space-y-6 mt-12">
          <KeyAlert
            title="Confirm"
            description={message}
          />
          <div className="flex justify-between">
            <BackButton />
            <Button onClick={() => setStep(step + 1)}>Create key</Button>
          </div>
        </div>
      </CreateKeyContent>
    );
  } else if (step == 5) {
    return (
      <CreateKeyContent>
        <Badges />
        <div className="flex flex-col space-y-6 mt-12">
          <KeyAlert
            title="Invitations"
            description="Share links to invite participants to join this key, each link may only be used once. Send the links using your favorite messaging or email app, when everyone joins we can continue."
          />
          <MeetingPoint
            session={createKeyState as SessionState}
            onMeetingPointReady={(keys) => setPublicKeys(keys)}
          />
        </div>
      </CreateKeyContent>
    );
  }

  return null;
}
