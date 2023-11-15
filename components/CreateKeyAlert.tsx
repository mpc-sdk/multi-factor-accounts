import React from "react";

import Icons from "@/components/Icons";
import KeyAlert from "@/components/KeyAlert";

export default function CreateKeyAlert() {
  return (
    <KeyAlert
      icon={<Icons.coffee className="h-4 w-4" />}
      title="Generating key share"
      description="Crunching the numbers to compute your key share securely, this may take a while so it's a good time to take a break."
    />
  );
}
