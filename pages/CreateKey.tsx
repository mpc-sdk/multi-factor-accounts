import React, { useState } from "react";
import Heading from "@/components/Heading";

import KeyShareAudienceForm, {
  KeyShareAudience,
} from "@/forms/KeyShareAudience";

import KeyShareNameForm from "@/forms/KeyShareName";

type CreateKeyState = {
  audience: KeyShareAudience;
  name?: string;
};

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
    console.log("Got key audience...");
    setCreateKeyState({ audience });
    setStep(step + 1);
  };

  const onKeyName = (name: string) => {
    console.log("Got key name", name);
    const newState = { ...createKeyState, name };
    setCreateKeyState(newState);
    setStep(step + 1);
  };

  console.log("step", step);

  if (step == 0) {
    return (
      <CreateKeyContent>
        <KeyShareAudienceForm onNext={onKeyAudience} />
      </CreateKeyContent>
    );
  } else if (step == 1) {
    return (
      <CreateKeyContent>
        <KeyShareNameForm onNext={onKeyName} />
      </CreateKeyContent>
    );
  } else if(step == 2) {
    return (
      <CreateKeyContent>
        <p>Get number of participants</p>
      </CreateKeyContent>
    );
  }

  return null;
}
