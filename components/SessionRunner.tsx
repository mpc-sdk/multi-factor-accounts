import React from "react";

import Loader from "@/components/Loader";

// View shown whilst a session is executing.
export default function SessionRunner({
  loaderText,
  executor,
}: {
  loaderText: string,
  executor: () => Promise<void>,
}) {
  return <Loader text={loaderText} />;
}
