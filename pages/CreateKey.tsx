import React, { useState } from "react";

import { Button } from "@/components/ui/button";

import Heading from "@/components/Heading";
import Icons from "@/components/Icons";
import KeyAlert from "@/components/KeyAlert";
import KeyBadge from "@/components/KeyBadge";
import MeetingPoint from "@/components/MeetingPoint";
import SessionRunner from "@/components/SessionRunner";

import KeyShareAudienceForm from "@/forms/KeyShareAudience";
import KeyShareNameForm from "@/forms/KeyShareName";
import KeyShareNumberForm from "@/forms/KeyShareNumber";

import { CreateKeyState, KeyShareAudience, OwnerType, SessionType, SessionState } from "@/app/model";

function CreateKeyContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Heading>Create Key</Heading>
      {children}
    </>
  );
}

export default function CreateKey() {
  const [step, setStep] = useState(0);
  const [createKeyState, setCreateKeyState] =
    useState<CreateKeyState>({
      ownerType: OwnerType.initiator,
      sessionType: SessionType.keygen,
    });
  const [publicKeys, setPublicKeys] = useState<string[]>(null);

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

  const startKeygen = async () => {
    console.log("Start key generation (initiator)..");
  };

  // Meeting is prepared so we can execute keygen
  if (publicKeys !== null) {
    return (
      <CreateKeyContent>
        <KeyBadge
          name={createKeyState.name}
          threshold={createKeyState.threshold}
          parties={createKeyState.parties} />
        <SessionRunner
          loaderText="Creating key share..."
          message={
            <KeyAlert
              title="Generating key share"
              description="Crunching the numbers to compute your key share securely"
              />
          }
          executor={startKeygen} />
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
        <KeyBadge
          name={createKeyState.name}
          threshold={createKeyState.threshold}
          parties={createKeyState.parties} />
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
        <KeyBadge
          name={createKeyState.name}
          threshold={createKeyState.threshold}
          parties={createKeyState.parties} />
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

    return (
      <CreateKeyContent>
        <KeyBadge
          name={createKeyState.name}
          threshold={createKeyState.threshold}
          parties={createKeyState.parties} />
        <div className="flex flex-col space-y-6 mt-12">
          <KeyAlert
            title="Confirm"
            description="Check the settings for the new key and confirm"
          />
          <p>
            Create a new key {audienceLabel} split into {parties} shares and
            require {threshold} participants to sign.
          </p>
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
        <KeyBadge
          name={createKeyState.name}
          threshold={createKeyState.threshold}
          parties={createKeyState.parties} />
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
