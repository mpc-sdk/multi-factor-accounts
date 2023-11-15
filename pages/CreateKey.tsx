import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { KeypairContext } from "@/app/providers/keypair";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import Heading from "@/components/Heading";
import KeyAlert from "@/components/KeyAlert";
import CreateKeyAlert from "@/components/CreateKeyAlert";
import KeyBadge from "@/components/KeyBadge";
import PublicKeyBadge from "@/components/PublicKeyBadge";
import MeetingPoint from "@/components/MeetingPoint";
import SessionRunner from "@/components/SessionRunner";
import SaveKeyShare from "@/components/SaveKeyShare";

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

import { PrivateKey } from "@/lib/types";
import guard from "@/lib/guard";
import { keygen, WebassemblyWorker } from "@/lib/client";
import { convertRawKey } from "@/lib/utils";

function BackButton({onClick}: {onClick: () => void}) {
  // NOTE: the type="button" is required so form submission on
  // NOTE: enter key works as expected.
  return <Button
    type="button" variant="outline" onClick={onClick}>
    Back
  </Button>
}

function CreateKeyContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Heading>Create Key</Heading>
      {children}
    </>
  );
}

export default function CreateKey() {
  const navigate = useNavigate();
  const keypair = useContext(KeypairContext);
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [keyShare, setKeyShare] = useState<PrivateKey>(null);
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

  const startKeygen = async (worker: WebassemblyWorker, serverUrl: string) => {
    console.log("Start key generation (initiator)..");
    await guard(async () => {
      // Public keys includes all members of the meeting but when
      // we initiate key generation the participants list should not
      // include the public key of the initiator
      const participants = publicKeys.filter((key) => key !== publicKey);

      const keyShare = await keygen(
        worker,
        serverUrl,
        {
          parties: createKeyState.parties,
          // Threshold is human-friendly but for the protocol
          // we need to cross the threshold hence the -1
          threshold: createKeyState.threshold - 1,
        },
        participants,
      );

      setKeyShare(convertRawKey(keyShare));
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

  if (keyShare !== null) {
    return (
      <CreateKeyContent>
        <Badges />
        <SaveKeyShare keyShare={keyShare} name={createKeyState.name} />
      </CreateKeyContent>
    );
  }

  // Meeting is prepared so we can execute keygen
  if (publicKeys !== null) {
    return (
      <CreateKeyContent>
        <Badges />
        <SessionRunner
          loaderText="Creating key share..."
          message={<CreateKeyAlert />}
          executor={startKeygen}
        />
      </CreateKeyContent>
    );
  }

  const backToAccounts = () => navigate('/');
  const defaultBack = () => setStep(step - 1);

  if (step == 0) {
    return (
      <CreateKeyContent>
        <KeyShareAudienceForm onNext={onKeyAudience}
          back={<BackButton onClick={backToAccounts} />} />
      </CreateKeyContent>
    );
  } else if (step == 1) {
    return (
      <CreateKeyContent>
        <KeyShareNameForm onNext={onKeyName}
          back={<BackButton onClick={defaultBack} />} />
      </CreateKeyContent>
    );
  } else if (step == 2) {
    return (
      <CreateKeyContent>
        <Badges />
        <KeyShareNumberForm
          back={<BackButton onClick={defaultBack} />}
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
          back={<BackButton onClick={defaultBack} />}
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
          <KeyAlert title="Confirm" description={message} />
          <div className="flex justify-between">
            <BackButton onClick={defaultBack} />
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
