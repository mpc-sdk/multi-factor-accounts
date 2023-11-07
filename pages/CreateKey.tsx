import React, { useState } from "react";
import Heading from "@/components/Heading";

import KeyShareAudienceForm, {
  KeyShareAudience,
} from "@/forms/KeyShareAudience";

type CreateKeyState = {
  audience: KeyShareAudience;
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
    setCreateKeyState({ audience });
    setStep(step + 1);
  };

  if (step == 0) {
    return (
      <CreateKeyContent>
        <KeyShareAudienceForm onNext={onKeyAudience} />
      </CreateKeyContent>
    );
  } else if (step == 1) {
    return (
      <CreateKeyContent>
        <p>Get parameters {createKeyState.audience}</p>
      </CreateKeyContent>
    );
  }

  return null;
}
