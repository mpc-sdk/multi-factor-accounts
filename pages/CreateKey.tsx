import React, { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import Heading from "@/components/Heading";
import Icons from "@/components/Icons";
import MeetingPoint from "@/components/MeetingPoint";

import KeyShareAudienceForm from "@/forms/KeyShareAudience";
import KeyShareNameForm from "@/forms/KeyShareName";
import KeyShareNumberForm from "@/forms/KeyShareNumber";

import { CreateKeyState, KeyShareAudience } from '@/app/model';

function CreateKeyHeading() {
  return <Heading>Create Key</Heading>;
}

function CreateKeyContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CreateKeyHeading />
      {children}
    </>
  );
}

export default function CreateKey() {
  const [step, setStep] = useState(0);
  const [createKeyState, setCreateKeyState] = useState<CreateKeyState>(null);

  const onKeyAudience = (audience: KeyShareAudience) => {
    setCreateKeyState({ audience });
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
    <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
  );

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
        <KeyShareNumberForm
          back={<BackButton />}
          onNext={onKeyParties}
          label="Participants"
          message={
            <Alert>
              <Icons.key className="h-4 w-4" />
              <AlertTitle>How many key shares?</AlertTitle>
              <AlertDescription>
                Choose the number of participants that will share this key.
              </AlertDescription>
            </Alert>
          }
        />
      </CreateKeyContent>
    );
  } else if (step == 3) {
    return (
      <CreateKeyContent>
        <KeyShareNumberForm
          back={<BackButton />}
          onNext={onKeyThreshold}
          label="Threshold"
          defaultValue={createKeyState.parties}
          max={createKeyState.parties}
          message={
            <Alert>
              <Icons.key className="h-4 w-4" />
              <AlertTitle>Set the threshold</AlertTitle>
              <AlertDescription>
                Choose how many participants are required to sign a message or
                transaction.
              </AlertDescription>
            </Alert>
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
        <div className="flex flex-col space-y-6 mt-12">
          <Alert>
            <Icons.key className="h-4 w-4" />
            <AlertTitle>Confirm</AlertTitle>
            <AlertDescription>
              Check the settings for the new key and confirm
            </AlertDescription>
          </Alert>
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
    return <CreateKeyContent>
      <div className="flex flex-col space-y-6 mt-12">
        <Alert>
          <Icons.key className="h-4 w-4" />
          <AlertTitle>Invitations</AlertTitle>
          <AlertDescription>
            Share links to invite participants to join this key, each link may only be used once. Send the links using your favorite messaging or email app, when everyone joins we can continue.
          </AlertDescription>
        </Alert>
        <MeetingPoint
          audience={createKeyState.audience}
          parties={createKeyState.parties} />
      </div>
    </CreateKeyContent>;
  }

  return null;
}
