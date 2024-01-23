import React from "react";

import Icons from "@/components/Icons";
import KeyAlert from "@/components/KeyAlert";

export default function CreateSignAlert() {
  return (
    <KeyAlert
      icon={<Icons.coffee className="h-4 w-4" />}
      title="Signing transaction"
      description="Crunching the numbers to sign your transaction securely, this may take a moment."
    />
  );
}
